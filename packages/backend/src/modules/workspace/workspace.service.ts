import type { TPositiveIdSchema, TWorkspace } from '@kanban-board/common';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { DataSource, EntityManager } from 'typeorm';

import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';
import WorkspaceMapper from '@/modules/workspace/libs/mappers/workspace.mapper';

@Injectable()
export default class WorkspaceService {
  constructor(
    private dataSource: DataSource,
    private workspaceMapper: WorkspaceMapper,
  ) {}

  /**
   * Создать рабочее пространство.
   * @param transactionalManager - транзакционный менеджер, переданный клиентским кодом.
   * @returns объект созданного рабочего пространства.
   * **/
  public async createWorkspace(transactionalManager: EntityManager): Promise<TWorkspace> {
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
      throw new WsException('Не удалось удалить рабочее пространство');
  }
}
