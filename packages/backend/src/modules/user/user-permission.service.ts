import {
  EBoardAccessUserPermissionType,
  EBoardUserPermissionType,
  EProfileUserPermissionType,
  EUserWorkspaceRole,
  type TPositiveIdSchema,
  type TUpdateUserPermissionBodySchema,
  type TUserPermissions,
} from '@kanban-board/common';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, type EntityTarget, type QueryDeepPartialEntity } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import BoardAccessUserPermissionEntity from '@/modules/user/libs/entities/board-access-user-permission.entity';
import BoardUserPermissionEntity from '@/modules/user/libs/entities/board-user-permission.entity';
import ProfileUserPermissionEntity from '@/modules/user/libs/entities/profile-user-permission.entity';
import UserEntity from '@/modules/user/libs/entities/user.entity';
import UserPermissionMapper from '@/modules/user/libs/mappers/user-permission.mapper';

@Injectable()
export default class UserPermissionService {
  constructor(
    private dataSource: DataSource,
    private userPermissionMapper: UserPermissionMapper,
  ) {}

  /**
   * Получить набор разрешений пользователя.
   * У OWNER разрешений нет (ему доступно все по роли), для него выбрасывается ошибка.
   * @param userId - Id пользователя.
   * @returns набор разрешений.
   * **/
  public async getUserPermissions(userId: TPositiveIdSchema): Promise<TUserPermissions> {
    const { manager } = this.dataSource;
    const user = await this.getUserWithPermissions(manager, userId);

    const boards = [...user.workspace.boards].sort((a, b) => a.order - b.order);

    return {
      profile: this.userPermissionMapper.toFields(
        Object.values(EProfileUserPermissionType),
        user.profilePermissions,
      ),
      board: this.userPermissionMapper.toFields(
        Object.values(EBoardUserPermissionType),
        user.boardPermissions,
      ),
      boardsAccesses: boards.map(board => ({
        id: board.id,
        title: board.title,
        permissions: this.userPermissionMapper.toFields(
          Object.values(EBoardAccessUserPermissionType),
          user.boardAccessPermissions.filter(permission => permission.boardId === board.id),
        ),
      })),
    };
  }

  /**
   * Обновить разрешение пользователя. Если true - добавить запись, если false - удалить запись.
   * Повторы идемпотентны.
   * @param userId - Id пользователя.
   * @param body - разрешение и целевое значение.
   * @returns void.
   * **/
  public async updateUserPermissions(
    userId: TPositiveIdSchema,
    body: TUpdateUserPermissionBodySchema,
  ): Promise<void> {
    const { manager } = this.dataSource;

    await manager.transaction(async transactionalManager => {
      const user = await this.getUserWithPermissions(transactionalManager, userId);

      switch (body.type) {
        case 'profile':
          await this.saveOrDeleteUserPermission(
            transactionalManager,
            ProfileUserPermissionEntity,
            body.value,
            { type: body.field, userId },
          );
          break;
        case 'board':
          await this.saveOrDeleteUserPermission(
            transactionalManager,
            BoardUserPermissionEntity,
            body.value,
            { type: body.field, userId },
          );
          break;
        case 'boardsAccesses': {
          const board = user.workspace.boards.find(item => item.id === body.boardId);
          if (!board) throw new NotFoundException('Доска не найдена');

          await this.saveOrDeleteUserPermission(
            transactionalManager,
            BoardAccessUserPermissionEntity,
            body.value,
            { type: body.field, userId, boardId: body.boardId },
          );
          break;
        }
      }
    });
  }

  /**
   * Получить пользователя с разрешениями и досками его пространства.
   * У OWNER разрешений нет, для него выбрасывается ошибка.
   * @param manager - менеджер сущностей или транзакции.
   * @param userId - Id пользователя.
   * @returns пользователь с разрешениями.
   * **/
  private async getUserWithPermissions(
    manager: EntityManager,
    userId: TPositiveIdSchema,
  ): Promise<UserEntity> {
    const user = await manager.findOne(UserEntity, {
      where: { id: userId },
      relations: {
        profilePermissions: true,
        boardPermissions: true,
        boardAccessPermissions: true,
        workspace: { boards: true },
      },
      // изменил с дефолтной 'join' стратегии чтобы множество связей не сформировало огромную таблицу из разных комбинаций связей (декартовы строки)
      relationLoadStrategy: 'query',
    });
    if (!user) throw new NotFoundException(`Пользователь по указанному идентификатору не найден`);

    if (user.workspaceRole === EUserWorkspaceRole.OWNER)
      throw new BadRequestException('У владельца пространства нет набора разрешений');

    return user;
  }

  /**
   * Привести запись разрешения к целевому значению.
   * Повторная вставка гасится уникальным индексом, повторное удаление ничего не удаляет.
   * @param manager - транзакционный менеджер.
   * @param entity - класс сущности разрешения.
   * @param value - true оставить запись, false удалить.
   * @param data - поля записи.
   * @returns void.
   * **/
  private async saveOrDeleteUserPermission<Entity extends BaseEntity>(
    manager: EntityManager,
    entity: EntityTarget<Entity>,
    value: boolean,
    data: QueryDeepPartialEntity<Entity>,
  ): Promise<void> {
    if (value) {
      await manager.createQueryBuilder().insert().into(entity).values(data).orIgnore().execute();
      return;
    }

    await manager.delete(entity, data);
  }
}
