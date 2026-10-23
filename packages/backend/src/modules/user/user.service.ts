import {
  EUserRole,
  EUserStatus,
  EWorkspaceRole,
  type TCreateUser,
  type TUser,
} from '@kanban-board/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import UserEntity from '@/modules/user/libs/entities/user.entity';
import UserWorkspaceEntity from '@/modules/user/libs/entities/user-workspace.entity';
import UserMapper from '@/modules/user/libs/mappers/user.mapper';

@Injectable()
export default class UserService {
  constructor(
    private dataSource: DataSource,
    private userMapper: UserMapper,
  ) {}

  public async createUser(body: TCreateUser): Promise<TUser> {
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);
    const { firstName, lastName, workspaceId, login, passwordHash } = body;
    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const DATABASE_LOCK_ID = 1003;
      // Блокируем доступ к базе данных для предотвращения одновременной регистрации нескольких аккаунтов.
      await transactionalManager.query('SELECT pg_advisory_xact_lock($1)', [DATABASE_LOCK_ID]);

      const newUser = transactionalManager.create(UserEntity, {
        firstName,
        lastName,
        workspaceId,
        login,
        passwordHash,
        systemRole: EUserRole.USER,
        status: EUserStatus.ACTIVE,
        avatar: null,
      });

      const createdUser = await transactionalManager.save(newUser);
      if (!createdUser) throw new BadRequestException(EXCEPTION_MESSAGES.createFailed);

      const newUserWorkspace = transactionalManager.create(UserWorkspaceEntity, {
        workspaceId,
        userId: createdUser.id,
        workspaceRole: EWorkspaceRole.OWNER,
      });

      const createdUserWorkspace = await transactionalManager.save(newUserWorkspace);
      if (!createdUserWorkspace) throw new BadRequestException(EXCEPTION_MESSAGES.createFailed);

      return this.userMapper.toModel(createdUser);
    });
  }
}
