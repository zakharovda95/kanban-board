import {
  EBoardAccessUserPermissionType,
  EBoardUserPermissionType,
  EProfileUserPermissionType,
  EUserWorkspaceRole,
  type TPositiveIdSchema,
  type TUpdateUserPermissionsBodySchema,
  type TUserPermissions,
} from '@kanban-board/common';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import BoardEntity from '@/modules/board/libs/entities/board.entity';
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
   * Заменить набор разрешений пользователя.
   * Хранятся только включенные разрешения, и их немного, поэтому в одной транзакции
   * старые записи удаляются и создаются заново по полям формы со значением true.
   * @param userId - Id пользователя.
   * @param body - форма разрешений.
   * @returns void.
   * **/
  public async updateUserPermissions(
    userId: TPositiveIdSchema,
    body: TUpdateUserPermissionsBodySchema,
  ): Promise<void> {
    const { manager } = this.dataSource;

    await manager.transaction(async transactionalManager => {
      const user = await transactionalManager.findOne(UserEntity, { where: { id: userId } });
      if (!user) throw new NotFoundException(`Пользователь по указанному идентификатору не найден`);

      if (user.workspaceRole === EUserWorkspaceRole.OWNER)
        throw new BadRequestException('У владельца пространства нет набора разрешений');

      const boards = await transactionalManager.find(BoardEntity, {
        where: { workspaceId: user.workspaceId },
        select: { id: true },
      });

      const workspaceBoardIds = new Set(boards.map(board => board.id));
      const payloadBoardIds = body.boardsAccesses.map(access => access.id);
      const uniquePayloadBoardIds = new Set(payloadBoardIds);
      const boardsMatch =
        uniquePayloadBoardIds.size === payloadBoardIds.length &&
        uniquePayloadBoardIds.size === workspaceBoardIds.size &&
        payloadBoardIds.every(id => workspaceBoardIds.has(id));

      if (!boardsMatch)
        throw new BadRequestException('Набор досок не совпадает с досками рабочего пространства');

      await transactionalManager.delete(ProfileUserPermissionEntity, { userId });
      await transactionalManager.delete(BoardUserPermissionEntity, { userId });
      await transactionalManager.delete(BoardAccessUserPermissionEntity, { userId });

      const profileRows = Object.values(EProfileUserPermissionType)
        .filter(type => body.profile[type])
        .map(type => ({ userId, type }));
      if (profileRows.length) {
        await transactionalManager.insert(ProfileUserPermissionEntity, profileRows);
      }

      const boardRows = Object.values(EBoardUserPermissionType)
        .filter(type => body.board[type])
        .map(type => ({ userId, type }));
      if (boardRows.length) {
        await transactionalManager.insert(BoardUserPermissionEntity, boardRows);
      }

      const accessRows = body.boardsAccesses.flatMap(boardAccess =>
        Object.values(EBoardAccessUserPermissionType)
          .filter(type => boardAccess.permissions[type])
          .map(type => ({ userId, boardId: boardAccess.id, type })),
      );
      if (accessRows.length) {
        await transactionalManager.insert(BoardAccessUserPermissionEntity, accessRows);
      }
    });
  }
}
