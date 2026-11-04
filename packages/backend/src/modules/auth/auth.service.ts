import {
  DatetimeUtility,
  EDateTimeComparison,
  EUserWorkspaceRole,
  RandomUtility,
  type TAuthLoginBodySchema,
  type TAuthRegisterBodySchema,
  type TAuthRegisterByInviteBodySchema,
  type TCreateUser,
} from '@kanban-board/common';
import { RandomServerUtility } from '@kanban-board/common/node';
import { PasswordHasher, SignInService } from '@nestjs/authentication';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import UserService from '@/modules/user/user.service';
import WorkspaceService from '@/modules/workspace/workspace.service';

@Injectable()
export class AuthService {
  constructor(
    private workspaceService: WorkspaceService,
    private userService: UserService,
    private dataSource: DataSource,
    private passwordHasher: PasswordHasher,
    private signInService: SignInService,
  ) {}

  /**
   * Зарегистрировать нового пользователя.
   * @param body - имя и фамилия пользователя.
   * @returns сгенерированные логин и пароль.
   * **/
  public async register(body: TAuthRegisterBodySchema): Promise<TAuthLoginBodySchema> {
    if (!body) throw new BadRequestException('Не переданы данные для регистрации');

    const { firstName, lastName } = body;

    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const DATABASE_LOCK_ID = 1003;
      // Блокируем доступ к базе данных для предотвращения одновременной регистрации нескольких аккаунтов.
      await transactionalManager.query('SELECT pg_advisory_xact_lock($1)', [DATABASE_LOCK_ID]);

      const { id: workspaceId } = await this.workspaceService.createWorkspace(transactionalManager);
      if (!workspaceId)
        throw new InternalServerErrorException(
          'Не удалось завершить регистрацию: ошибка при создании рабочего пространства',
        );

      const login = RandomUtility.generateRandomLogin(firstName, lastName);
      const password = RandomServerUtility.generateRandomPassword();
      const passwordHash = await this.passwordHasher.hash(password);

      const newUserBody: TCreateUser = {
        firstName,
        lastName,
        workspaceId,
        login,
        passwordHash,
        workspaceRole: EUserWorkspaceRole.OWNER,
      };

      const createdUser = await this.userService.createUser(transactionalManager, newUserBody);
      if (!createdUser)
        throw new InternalServerErrorException(
          'Не удалось завершить регистрацию: ошибка при создании пользователя',
        );

      return { login, password };
    });
  }

  /**
   * Добавить нового пользователя в пространство.
   * @param body - имя и фамилия пользователя и пригласительный.
   * @returns сгенерированные логин и пароль.
   * **/
  public async registerByInvite(
    body: TAuthRegisterByInviteBodySchema,
  ): Promise<TAuthLoginBodySchema> {
    if (!body)
      throw new BadRequestException(
        'Не переданы данные, необходимые для добавления пользователя в пространство',
      );

    const { firstName, lastName, inviteToken } = body;

    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const DATABASE_LOCK_ID = 1004;
      // Блокируем доступ к базе данных для предотвращения одновременной регистрации нескольких аккаунтов.
      await transactionalManager.query('SELECT pg_advisory_xact_lock($1)', [DATABASE_LOCK_ID]);

      const {
        id: inviteId,
        expiresAt,
        workspaceId,
      } = await this.workspaceService.getWorkspaceInvite(transactionalManager, inviteToken);

      if (DatetimeUtility.compareDates(expiresAt, new Date(), EDateTimeComparison.LESS))
        throw new BadRequestException('Срок действия приглашения вышел');

      const login = RandomUtility.generateRandomLogin(firstName, lastName);
      const password = RandomServerUtility.generateRandomPassword();
      const passwordHash = await this.passwordHasher.hash(password);

      const newUserBody: TCreateUser = {
        firstName,
        lastName,
        workspaceId,
        login,
        passwordHash,
        workspaceRole: EUserWorkspaceRole.USER,
      };

      const createdUser = await this.userService.createUser(transactionalManager, newUserBody);
      if (!createdUser)
        throw new InternalServerErrorException(
          'Не удалось завершить регистрацию: ошибка при создании пользователя',
        );

      await this.workspaceService.deleteWorkspaceInvite(transactionalManager, inviteId);

      return { login, password };
    });
  }

  /**
   * Войти в систему.
   * @param body - логин и пароль пользователя.
   * @returns void.
   * **/
  public async login(body: TAuthLoginBodySchema): Promise<void> {
    if (!body) throw new BadRequestException('Не указаны данные аутентификации');
    const { login, password } = body;

    const { userId, passwordHash } = await this.userService.getUserCredentialsBy(login);
    if (!userId || !passwordHash) throw new UnauthorizedException('Не верный логин или пароль');

    const isValid = await this.verify(userId, passwordHash, password);
    if (!isValid) throw new UnauthorizedException('Не верный логин или пароль');

    const session = await this.signInService.signIn(String(userId), { method: 'password' });
    if (!session) throw new InternalServerErrorException('Не удалось войти в систему');
  }

  /**
   * Выйти из системы и удалить сессию.
   * @returns void.
   * **/
  public async logout(): Promise<void> {
    const result = await this.signInService.signOut();
    if (!result) throw new InternalServerErrorException('Не удалось выйти из системы');
  }

  /**
   * Сравнить пароли. При необходимости перевыпустить hash.
   * @param userId - Id пользователя.
   * @param passwordHash - хэш пароля.
   * @param password - пароль в сыром виде.
   * @returns сгенерированные логин и пароль.
   * **/
  private async verify(userId: number, passwordHash: string, password: string): Promise<boolean> {
    if (!userId) throw new BadRequestException('Не передан идентификатор пользователя');
    if (!passwordHash || !password) throw new BadRequestException('Не передан пароль');

    const isValid = await this.passwordHasher.verify(password, passwordHash);
    if (!isValid) return false;

    // Если меняются параметры хранения хэша перевыпускаем хэш, внутренний процесс, мы не влияем.
    if (this.passwordHasher.needsRehash(passwordHash)) {
      const newPasswordHash = await this.passwordHasher.hash(password);
      await this.userService.updateUserPasswordHash(userId, newPasswordHash);
    }

    return true;
  }
}
