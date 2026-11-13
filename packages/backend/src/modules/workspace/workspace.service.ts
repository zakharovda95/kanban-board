import {
  EUserWorkspaceRole,
  type TCreateWorkspaceInviteBodySchema,
  type TCreateWorkspaceInviteToken,
  type TPositiveIdSchema,
  type TWorkspace,
  type TWorkspaceBase,
  type TWorkspaceInvite,
  TWorkspaceInvites,
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

import UserEntity from '@/modules/user/libs/entities/user.entity';
import UserWorkspaceEntity from '@/modules/user/libs/entities/user-workspace.entity';
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
}
