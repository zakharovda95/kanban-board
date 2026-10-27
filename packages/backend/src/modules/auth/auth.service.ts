import {
  RandomUtility,
  type TAuthLoginBodySchema,
  type TAuthRegisterBodySchema,
  type TCreateUser,
  USER_FIRST_NAMES,
  USER_LAST_NAMES,
} from '@kanban-board/common';
import { RandomServerUtility } from '@kanban-board/common/node';
import { PasswordHasher, SignInService } from '@nestjs/authentication';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

  public async register(body: TAuthRegisterBodySchema): Promise<TAuthLoginBodySchema> {
    if (!body) throw new BadRequestException('Не переданы данные для регистрации');

    const { firstName, lastName } = body;

    if (!USER_FIRST_NAMES.includes(firstName))
      throw new BadRequestException(
        `Невозможно зарегистрировать пользователя с именем ${firstName}`,
      );

    if (!USER_LAST_NAMES.includes(lastName))
      throw new BadRequestException(
        `Невозможно зарегистрировать пользователя с фамилией ${lastName}`,
      );

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
      };

      const createdUser = await this.userService.createUser(transactionalManager, newUserBody);
      if (!createdUser)
        throw new InternalServerErrorException(
          'Не удалось завершить регистрацию: ошибка при создании пользователя',
        );

      return { login, password };
    });
  }

  public async login(body: TAuthLoginBodySchema): Promise<void> {
    if (!body) throw new BadRequestException('Не указаны данные аутентификации');
    const { login, password } = body;

    const { userId, passwordHash } = await this.userService.getUserCredentialsBy(login);
    if (!userId || !passwordHash)
      throw new NotFoundException('Пользователь по указанному логину не найден');

    const isValid = await this.verify(userId, passwordHash, password);
    if (!isValid) throw new UnauthorizedException('Не верный логин или пароль');

    const { session } = await this.signInService.signIn(String(userId), { method: 'password' });
    console.log(session);
  }

  private async verify(userId: number, passwordHash: string, password: string): Promise<boolean> {
    if (!userId) throw new BadRequestException('Не передан идентификатор пользователя');
    if (!passwordHash || !password) throw new BadRequestException('Не передан пароль');

    const isValid = await this.passwordHasher.verify(password, passwordHash);
    if (!isValid) return false;

    if (this.passwordHasher.needsRehash(passwordHash)) {
      const newPasswordHash = await this.passwordHasher.hash(password);
      await this.userService.updateUserPasswordHash(userId, newPasswordHash);
    }

    return true;
  }
}
