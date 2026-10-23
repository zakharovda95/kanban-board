import {
  PasswordUtility,
  RandomUtility,
  sleep,
  type TAuthData,
  type TAuthLoginPayload,
  type TAuthRegister,
} from '@kanban-board/common';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import UserService from '@/modules/user/user.service';
import WorkspaceService from '@/modules/workspace/workspace.service';

@Injectable()
export class AuthService {
  constructor(
    private workspaceService: WorkspaceService,
    private userService: UserService,
    private dataSource: DataSource,
  ) {}

  public async register(body: TAuthRegister): Promise<TAuthData> {
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { firstName, lastName } = body;
    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const DATABASE_LOCK_ID = 1005;
      // Блокируем доступ к базе данных для предотвращения одновременной регистрации нескольких аккаунтов.
      await transactionalManager.query('SELECT pg_advisory_xact_lock($1)', [DATABASE_LOCK_ID]);

      const { id: workspaceId } = await this.workspaceService.createWorkspace();
      if (!workspaceId) throw new InternalServerErrorException(EXCEPTION_MESSAGES.createFailed);

      const login = RandomUtility.generateRandomLogin(firstName, lastName);
      const password = RandomUtility.generateRandomPassword();
      const passwordHash = await PasswordUtility.hashPassword(password);

      const createdUser = await this.userService.createUser({
        firstName,
        lastName,
        workspaceId,
        login,
        passwordHash,
      });
      if (!createdUser) throw new InternalServerErrorException(EXCEPTION_MESSAGES.createFailed);

      return { login, password };
    });
  }

  public async login(body: TAuthData): Promise<TAuthLoginPayload> {
    await sleep(1000);
    console.log(body);
    return { token: '123' };
  }
}
