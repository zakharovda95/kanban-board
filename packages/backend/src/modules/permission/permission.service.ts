import {
  EBoardAccessPermissionField,
  EBoardPermissionField,
  EPermissionType,
  EProfilePermissionField,
  EUserWorkspaceRole,
  type TPermissions,
  type TPositiveIdSchema,
  type TUpdatePermissionBodySchema,
} from '@kanban-board/common';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, type EntityTarget, type QueryDeepPartialEntity } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import BoardAccessPermissionEntity from '@/modules/permission/libs/entities/board-access-permission.entity';
import BoardPermissionEntity from '@/modules/permission/libs/entities/board-permission.entity';
import ProfilePermissionEntity from '@/modules/permission/libs/entities/profile-permission.entity';
import PermissionMapper from '@/modules/permission/libs/mappers/permission.mapper';
import UserEntity from '@/modules/user/libs/entities/user.entity';

@Injectable()
export default class PermissionService {
  constructor(
    private dataSource: DataSource,
    private permissionMapper: PermissionMapper,
  ) {}

  /**
   * Получить набор разрешений пользователя.
   * У OWNER разрешений нет (ему доступно все по роли), для него выбрасывается ошибка.
   * @param userId - Id пользователя.
   * @returns набор разрешений.
   * **/
  public async getPermissions(userId: TPositiveIdSchema): Promise<TPermissions> {
    const { manager } = this.dataSource;
    const user = await this.getUserWithPermissions(manager, userId);

    const boards = [...user.workspace.boards].sort((a, b) => a.order - b.order);

    return {
      [EPermissionType.PROFILE]: this.permissionMapper.toFields(
        Object.values(EProfilePermissionField),
        user.profilePermissions,
      ),
      [EPermissionType.BOARD]: this.permissionMapper.toFields(
        Object.values(EBoardPermissionField),
        user.boardPermissions,
      ),
      [EPermissionType.BOARD_ACCESSES]: boards.map(board => ({
        id: board.id,
        title: board.title,
        permissions: this.permissionMapper.toFields(
          Object.values(EBoardAccessPermissionField),
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
  public async updatePermission(
    userId: TPositiveIdSchema,
    body: TUpdatePermissionBodySchema,
  ): Promise<void> {
    const { manager } = this.dataSource;

    await manager.transaction(async transactionalManager => {
      const user = await this.getUserWithPermissions(transactionalManager, userId);

      switch (body.type) {
        case EPermissionType.PROFILE:
          await this.saveOrDeletePermission(
            transactionalManager,
            ProfilePermissionEntity,
            body.value,
            { field: body.field, userId },
          );
          break;
        case EPermissionType.BOARD:
          await this.saveOrDeletePermission(
            transactionalManager,
            BoardPermissionEntity,
            body.value,
            { field: body.field, userId },
          );
          break;
        case EPermissionType.BOARD_ACCESSES: {
          const board = user.workspace.boards.find(item => item.id === body.boardId);
          if (!board) throw new NotFoundException('Доска не найдена');

          await this.saveOrDeletePermission(
            transactionalManager,
            BoardAccessPermissionEntity,
            body.value,
            { field: body.field, userId, boardId: body.boardId },
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
      // изменил с дефолтной 'join' стратегии чтобы множество связей не формировало огромную таблицу (декартовы строки)
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
  private async saveOrDeletePermission<Entity extends BaseEntity>(
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
