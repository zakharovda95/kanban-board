import {
  EUserWorkspaceRole,
  type TPositiveIdSchema,
  type TWorkspace,
  type TWorkspaceBase,
  type TWorkspaceInvites,
  type TWorkspaceUsers,
  WORKSPACE_USERS_MAX_COUNT,
} from '@kanban-board/common';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, MoreThan } from 'typeorm';

import UserEntity from '@/modules/user/libs/entities/user.entity';
import UserMapper from '@/modules/user/libs/mappers/user.mapper';
import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';
import WorkspaceInviteEntity from '@/modules/workspace/libs/entities/workspace-invite.entity';
import WorkspaceMapper from '@/modules/workspace/libs/mappers/workspace.mapper';
import WorkspaceInviteMapper from '@/modules/workspace/libs/mappers/workspace-invite.mapper';

@Injectable()
export default class WorkspaceService {
  constructor(
    private dataSource: DataSource,
    private workspaceMapper: WorkspaceMapper,
    private userMapper: UserMapper,
    private workspaceInviteMapper: WorkspaceInviteMapper,
  ) {}

  /**
   * Получить рабочее пространство вместе со владельцем и пользователями.
   * @param workspaceId - Id пространства.
   * @returns объект рабочего пространства с пользователями и владельцем.
   * **/
  public async getWorkspace(workspaceId: TPositiveIdSchema): Promise<TWorkspace> {
    const { manager } = this.dataSource;

    const workspace = await manager.findOne(WorkspaceEntity, {
      where: { id: workspaceId },
    });
    if (!workspace) throw new NotFoundException('Рабочее пространство не найдено');

    const workspaceModel = this.workspaceMapper.toModel(workspace);

    const users = await manager.find(UserEntity, {
      where: {
        workspaceId,
        workspaceRole: EUserWorkspaceRole.USER,
      },
    });

    const userModels = this.userMapper.toModel(users, { base: true });

    const usersData: TWorkspaceUsers = {
      users: userModels,
      total: WORKSPACE_USERS_MAX_COUNT,
      available: WORKSPACE_USERS_MAX_COUNT - userModels.length,
      occupied: userModels.length,
    };

    const invites = await manager.find(WorkspaceInviteEntity, {
      where: {
        workspaceId,
        expiresAt: MoreThan(new Date()),
      },
    });

    const workspaceInviteModels = this.workspaceInviteMapper.toModel(invites);

    const totalInvites = WORKSPACE_USERS_MAX_COUNT - userModels.length;
    const invitesData: TWorkspaceInvites = {
      invites: workspaceInviteModels,
      total: totalInvites,
      available: totalInvites - workspaceInviteModels.length,
      occupied: workspaceInviteModels.length,
    };

    return { ...workspaceModel, users: usersData, invites: invitesData };
  }

  /**
   * Создать рабочее пространство.
   * @param transactionalManager - транзакционный менеджер, переданный клиентским кодом.
   * @returns объект созданного рабочего пространства.
   * **/
  public async createWorkspace(transactionalManager: EntityManager): Promise<TWorkspaceBase> {
    const newWorkspace = transactionalManager.create(WorkspaceEntity);
    const createdWorkspace = await transactionalManager.save(newWorkspace);

    return this.workspaceMapper.toModel(createdWorkspace);
  }

  /**
   * Удалить рабочее пространство.
   * @param workspaceId - Id пространства, которое нужно удалить.
   * @returns void.
   * **/
  public async deleteWorkspace(workspaceId: TPositiveIdSchema): Promise<void> {
    const { manager } = this.dataSource;

    const { affected } = await manager.delete(WorkspaceEntity, { id: workspaceId });
    if (!affected || affected <= 0)
      throw new InternalServerErrorException('Не удалось удалить рабочее пространство');
  }
}
