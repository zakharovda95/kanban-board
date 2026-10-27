import type { TWorkspace } from '@kanban-board/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
}
