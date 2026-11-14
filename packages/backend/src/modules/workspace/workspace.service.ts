import {
  EUserWorkspaceRole,
  type TPositiveIdSchema,
  type TWorkspace,
  type TWorkspaceBase,
  TWorkspaceInvites,
  WORKSPACE_USERS_MAX_COUNT,
} from '@kanban-board/common';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    if (!workspaceId)
      throw new BadRequestException('Не передан идентификатор рабочего пространства');

    const { manager } = this.dataSource;

    const workspace = await manager.findOne(WorkspaceEntity, {
      where: { id: workspaceId },
    });
    if (!workspace) throw new NotFoundException('Рабочее пространство не найдено');

    const workspaceModel = this.workspaceMapper.toModel(workspace);

    const users = await manager.find(UserEntity, {
      where: {
        userWorkspace: {
          workspaceId,
          workspaceRole: EUserWorkspaceRole.USER,
        },
      },
      relations: { userWorkspace: true },
    });

    const userModels = this.userMapper.toModel(users, { base: false });

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

    return { ...workspaceModel, users: userModels, invites: invitesData };
  }

  /**
   * Создать рабочее пространство.
   * @param transactionalManager - транзакционный менеджер, переданный клиентским кодом.
   * @returns объект созданного рабочего пространства.
   * **/
  public async createWorkspace(transactionalManager: EntityManager): Promise<TWorkspaceBase> {
    if (!transactionalManager)
      throw new InternalServerErrorException('Произошла ошибка в транзакции');

    const newWorkspace = transactionalManager.create(WorkspaceEntity);

    const createdWorkspace = await transactionalManager.save(newWorkspace);
    if (!createdWorkspace)
      throw new InternalServerErrorException('Не удалось создать рабочее пространство');

    return this.workspaceMapper.toModel(createdWorkspace);
  }

  /**
   * Удалить рабочее пространство.
   * @param workspaceId - Id пространства, которое нужно удалить.
   * @returns void.
   * **/
  public async deleteWorkspace(workspaceId: TPositiveIdSchema): Promise<void> {
    if (!workspaceId)
      throw new BadRequestException('Не передан идентификатор рабочего пространства');

    const { manager } = this.dataSource;

    const { affected } = await manager.delete(WorkspaceEntity, { id: workspaceId });
    if (!affected || affected <= 0)
      throw new InternalServerErrorException('Не удалось удалить рабочее пространство');
  }
}
