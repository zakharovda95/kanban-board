import {
  type TCreateWorkspaceInviteToken,
  type TPositiveIdSchema,
  type TWorkspace,
  type TWorkspaceBase,
  type TWorkspaceInvite,
  WORKSPACE_USERS_MAX_COUNT,
} from '@kanban-board/common';
import { HashServerUtility, RandomServerUtility } from '@kanban-board/common/node';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, MoreThan } from 'typeorm';

import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';
import WorkspaceInviteEntity from '@/modules/workspace/libs/entities/workspace-invite.entity';
import WorkspaceMapper from '@/modules/workspace/libs/mappers/workspace.mapper';
import WorkspaceInviteMapper from '@/modules/workspace/libs/mappers/workspace-invite.mapper';

@Injectable()
export default class WorkspaceService {
  constructor(
    private dataSource: DataSource,
    private workspaceMapper: WorkspaceMapper,
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

    // Получаем рабочее пространство со всеми связями (в т.ч. и workspace) для правильного маппинга полного объекта
    const workspace = await manager.findOne(WorkspaceEntity, {
      where: { id: workspaceId },
      relations: {
        userWorkspaces: {
          user: true,
          workspace: true,
        },
      },
      order: {
        userWorkspaces: {
          createdAt: 'ASC',
        },
      },
    });
    if (!workspace) throw new NotFoundException('Рабочее пространство не найдено');

    return this.workspaceMapper.toModel(workspace, { base: false });
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
      throw new InternalServerErrorException('Не удалось удалить рабочее пространство');
  }

  /**
   * Сгенерировать пригласительный токен.
   * @param workspaceId - Id пространства, куда будет приглашен пользователь.
   * @returns void.
   * **/
  public async createInviteToken(
    workspaceId: TPositiveIdSchema,
  ): Promise<TCreateWorkspaceInviteToken> {
    if (!workspaceId)
      throw new BadRequestException('Не передан идентификатор рабочего пространства');

    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const DATABASE_LOCK_ID = 1005;
      // Блокируем доступ к базе данных для предотвращения одновременного создания нескольких приглашений.
      await transactionalManager.query('SELECT pg_advisory_xact_lock($1)', [DATABASE_LOCK_ID]);

      const workspace = await transactionalManager.findOne(WorkspaceEntity, {
        where: { id: workspaceId },
        relations: { userWorkspaces: true },
      });

      if (!workspace)
        throw new NotFoundException('Рабочее пространство по указанному идентификатору не найдено');

      // Вычитаем владельца
      const OWNERS_COUNT = 1;
      const activeUsersCount = workspace.userWorkspaces.length - OWNERS_COUNT;

      const invitesCount = await transactionalManager.count(WorkspaceInviteEntity, {
        where: { workspaceId, expiresAt: MoreThan(new Date()) },
      });

      if (invitesCount + activeUsersCount >= WORKSPACE_USERS_MAX_COUNT)
        throw new BadRequestException('Создано максимальное количество приглашений');

      const inviteToken = RandomServerUtility.generateRandomPassword(32, 'base64url');

      const newToken = transactionalManager.create(WorkspaceInviteEntity, {
        workspaceId,
        inviteTokenHash: HashServerUtility.sha256(inviteToken),
      });

      const createdToken = await transactionalManager.save(newToken);
      if (!createdToken)
        throw new InternalServerErrorException('Не удалось сгенерировать инвайт-токен');

      return {
        inviteToken,
        expiresAt: createdToken.expiresAt,
      };
    });
  }

  /**
   * Получить данные приглашения в пространство.
   * @param transactionalManager - транзакционный менеджер, переданный клиентским кодом.
   * @param inviteToken - инвайт-токен.
   * @returns объект приглашения в пространство.
   * **/
  public async getWorkspaceInvite(
    transactionalManager: EntityManager,
    inviteToken: string,
  ): Promise<TWorkspaceInvite> {
    if (!transactionalManager)
      throw new InternalServerErrorException('Произошла ошибка в транзакции');
    if (!inviteToken) throw new BadRequestException('Не передан инвайт-токен');

    // Сравниваем хэши напрямую в базе
    const invite = await transactionalManager.findOne(WorkspaceInviteEntity, {
      where: { inviteTokenHash: HashServerUtility.sha256(inviteToken) },
    });
    if (!invite) throw new NotFoundException('Приглашение в пространство не найдено');

    return this.workspaceInviteMapper.toModel(invite);
  }

  /**
   * Удалить приглашения в пространство.
   * @param transactionalManager - транзакционный менеджер, переданный клиентским кодом.
   * @param inviteId - ID приглашения.
   * @returns void.
   * **/
  public async deleteWorkspaceInvite(
    transactionalManager: EntityManager,
    inviteId: number,
  ): Promise<void> {
    if (!transactionalManager)
      throw new InternalServerErrorException('Произошла ошибка в транзакции');
    if (!inviteId)
      throw new BadRequestException('Не передан идентификатор приглашения в рабочее пространство');

    const { affected } = await transactionalManager.delete(WorkspaceInviteEntity, { id: inviteId });
    if (!affected || affected <= 0)
      throw new InternalServerErrorException(
        'Не удалось удалить приглашение в рабочее пространство',
      );
  }
}
