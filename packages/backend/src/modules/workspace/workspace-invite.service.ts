import {
  EUserWorkspaceRole,
  TCreateWorkspaceInviteBodySchema,
  TCreateWorkspaceInviteToken,
  TPositiveIdSchema,
  TWorkspaceInvite,
  WORKSPACE_USERS_MAX_COUNT,
} from '@kanban-board/common';
import { HashServerUtility, RandomServerUtility } from '@kanban-board/common/node';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource, EntityManager, LessThanOrEqual, MoreThan } from 'typeorm';

import UserWorkspaceEntity from '@/modules/user/libs/entities/user-workspace.entity';
import WorkspaceInviteEntity from '@/modules/workspace/libs/entities/workspace-invite.entity';
import WorkspaceInviteMapper from '@/modules/workspace/libs/mappers/workspace-invite.mapper';

@Injectable()
export default class WorkspaceInviteService {
  constructor(
    private dataSource: DataSource,
    private workspaceInviteMapper: WorkspaceInviteMapper,
  ) {}

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
   * Сгенерировать приглашение.
   * @param workspaceId - Id пространства, куда будет приглашен пользователь.
   * @param body - название приглашения.
   * @returns void.
   * **/
  public async createInvite(
    workspaceId: TPositiveIdSchema,
    body: TCreateWorkspaceInviteBodySchema,
  ): Promise<TCreateWorkspaceInviteToken> {
    if (!workspaceId)
      throw new BadRequestException('Не передан идентификатор рабочего пространства');
    if (!body)
      throw new BadRequestException(
        'Не переданы данные для создания приглашения в рабочее пространство',
      );

    const { name } = body;
    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const DATABASE_LOCK_ID = 1005;
      // Блокируем доступ к базе данных для предотвращения одновременного создания нескольких приглашений.
      await transactionalManager.query('SELECT pg_advisory_xact_lock($1)', [DATABASE_LOCK_ID]);

      const activeUsersCount = await transactionalManager.count(UserWorkspaceEntity, {
        where: { workspaceId, workspaceRole: EUserWorkspaceRole.USER },
      });

      const invitesCount = await transactionalManager.count(WorkspaceInviteEntity, {
        where: { workspaceId, expiresAt: MoreThan(new Date()) },
      });

      if (invitesCount + activeUsersCount >= WORKSPACE_USERS_MAX_COUNT)
        throw new BadRequestException('Создано максимальное количество приглашений');

      const inviteToken = RandomServerUtility.generateRandomPassword(32, 'base64url');

      const newToken = transactionalManager.create(WorkspaceInviteEntity, {
        name,
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
   * Удалить приглашения в пространство.
   * @param inviteId - ID приглашения.
   * @param transactionalManager - если передано: транзакционный менеджер, переданный клиентским кодом, для выполнения операции в одной транзакции.
   * @returns void.
   * **/
  public async deleteWorkspaceInvite(
    inviteId: number,
    transactionalManager: EntityManager | undefined = undefined,
  ): Promise<void> {
    if (!inviteId)
      throw new BadRequestException('Не передан идентификатор приглашения в рабочее пространство');

    const manager = transactionalManager || this.dataSource.manager;

    const { affected } = await manager.delete(WorkspaceInviteEntity, { id: inviteId });
    if (!affected || affected <= 0)
      throw new InternalServerErrorException(
        'Не удалось удалить приглашение в рабочее пространство',
      );
  }

  /** Удалить истекшие приглашения из базы. Проход кроны каждый день в час ночи. **/
  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'DeleteWorkspaceInvitesCron',
  })
  public async deleteExpiredWorkspaceInvitesCron() {
    const { manager } = this.dataSource;

    await manager.delete(WorkspaceInviteEntity, {
      where: { expiresAt: LessThanOrEqual(new Date()) },
    });
  }
}
