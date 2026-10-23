import type { TWorkspace } from '@kanban-board/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';
import WorkspaceMapper from '@/modules/workspace/libs/mappers/workspace.mapper';

@Injectable()
export default class WorkspaceService {
  constructor(
    private dataSource: DataSource,
    private workspaceMapper: WorkspaceMapper,
  ) {}

  public async createWorkspace(): Promise<TWorkspace> {
    const { manager } = this.dataSource;
    return manager.transaction(async transactionalManager => {
      const DATABASE_LOCK_ID = 1004;
      // Блокируем доступ к базе данных для предотвращения одновременного создания рабочих пространств.
      await transactionalManager.query('SELECT pg_advisory_xact_lock($1)', [DATABASE_LOCK_ID]);

      const newWorkspace = transactionalManager.create(WorkspaceEntity);

      const createdWorkspace = await transactionalManager.save(newWorkspace);
      if (!createdWorkspace)
        throw new InternalServerErrorException(EXCEPTION_MESSAGES.createFailed);

      return this.workspaceMapper.toModel(createdWorkspace);
    });
  }
}
