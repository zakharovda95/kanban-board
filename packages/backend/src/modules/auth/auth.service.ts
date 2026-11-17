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
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import UserService from '@/modules/user/user.service';
import WorkspaceService from '@/modules/workspace/workspace.service';
import WorkspaceInviteService from '@/modules/workspace/workspace-invite.service';

@Injectable()
export class AuthService {
  constructor(
    private workspaceService: WorkspaceService,
    private workspaceInviteService: WorkspaceInviteService,
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
    const { firstName, lastName } = body;

    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const DATABASE_LOCK_ID = 1003;
      // Блокируем доступ к базе данных для предотвращения одновременной регистрации нескольких аккаунтов.
      await transactionalManager.query('SELECT pg_advisory_xact_lock($1)', [DATABASE_LOCK_ID]);

      const { id: workspaceId } = await this.workspaceService.createWorkspace(transactionalManager);

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

      await this.userService.createUser(transactionalManager, newUserBody);

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
      } = await this.workspaceInviteService.getWorkspaceInvite(transactionalManager, inviteToken);

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

      await this.userService.createUser(transactionalManager, newUserBody);
      await this.workspaceInviteService.deleteWorkspaceInvite(inviteId, transactionalManager);

      return { login, password };
    });
  }

  /**
   * Войти в систему.
   * @param body - логин и пароль пользователя.
   * @returns void.
   * **/
  public async login(body: TAuthLoginBodySchema): Promise<void> {
    const { login, password } = body;

    const { userId, passwordHash } = await this.userService.getUserCredentialsBy(login);

    const isValid = await this.verify(userId, passwordHash, password);
    if (!isValid) throw new UnauthorizedException('Не верный логин или пароль');

    await this.signInService.signIn(String(userId), { method: 'password' });
  }

  /**
   * Выйти из системы и удалить сессию.
   * @returns void.
   * **/
  public async logout(): Promise<void> {
    await this.signInService.signOut();
  }

  /**
   * Сравнить пароли. При необходимости перевыпустить hash.
   * @param userId - Id пользователя.
   * @param passwordHash - хэш пароля.
   * @param password - пароль в сыром виде.
   * @returns сгенерированные логин и пароль.
   * **/
  private async verify(userId: number, passwordHash: string, password: string): Promise<boolean> {
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
