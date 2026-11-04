import {
  EUserWorkspaceRole,
  type TPositiveIdSchema,
  type TWorkspace,
  type TWorkspaceBase,
} from '@kanban-board/common';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { DataSource, EntityManager, Not } from 'typeorm';

import UserWorkspaceEntity from '@/modules/user/libs/entities/user-workspace.entity';
import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';
import WorkspaceMapper from '@/modules/workspace/libs/mappers/workspace.mapper';

@Injectable()
export default class WorkspaceService {
  constructor(
    private dataSource: DataSource,
    private workspaceMapper: WorkspaceMapper,
  ) {}

  /**
   * Получить рабочее пространство вместе с приглашенными пользователями.
   * Владелец в список не входит: его профиль настраивается отдельно, и он не учитывается в лимите.
   * @param workspaceId - Id пространства.
   * @returns объект рабочего пространства с пользователями, у которых роль не OWNER.
   * **/
  public async getWorkspace(workspaceId: TPositiveIdSchema): Promise<TWorkspace> {
    if (!workspaceId)
      throw new BadRequestException('Не передан идентификатор рабочего пространства');

    const { manager } = this.dataSource;

    const workspace = await manager.findOne(WorkspaceEntity, { where: { id: workspaceId } });
    if (!workspace) throw new NotFoundException('Рабочее пространство не найдено');

    workspace.userWorkspaces = await manager.find(UserWorkspaceEntity, {
      where: {
        workspaceId,
        workspaceRole: Not(EUserWorkspaceRole.OWNER),
      },
      relations: { user: true, workspace: true },
      order: { createdAt: 'ASC' },
    });

    return this.workspaceMapper.toModel(workspace, { base: false });
  }

  /**
   * Создать рабочее пространство.
   * @param transactionalManager - транзакционный менеджер, переданный клиентским кодом.
   * @returns объект созданного рабочего пространства.
   * **/
  public async createWorkspace(transactionalManager: EntityManager): Promise<TWorkspaceBase> {
    const newWorkspace = transactionalManager.create(WorkspaceEntity);

    const createdWorkspace = await transactionalManager.save(newWorkspace);
    if (!createdWorkspace)
      throw new InternalServerErrorException('Не удалось создать рабочее пространство');

    return this.workspaceMapper.toModel(createdWorkspace, { base: true });
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
      throw new WsException('Не удалось удалить рабочее пространство');
  }
}
