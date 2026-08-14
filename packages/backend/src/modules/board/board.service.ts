import type {
  TBoard,
  TBoardBase,
  TCreateBoard,
  TDeleteBoardEmitPayload,
  TMoveParameters,
  TSuccessResponse,
  TUpdateBoard,
} from '@kanban-board/common';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { cloneDeep } from 'lodash';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import { OrderUtility } from '@/libs/utilities/order.utility';
import { getSuccessResponse } from '@/libs/utilities/response.utilities';
import { BoardMapper } from '@/modules/board/board.mapper';
import { BoardEntity } from '@/modules/board/libs/entities/board.entity';
import { DEFAULT_COLUMNS } from '@/modules/column/libs/constants/column.constants';
import { MoveService } from '@/modules/shared/move/move.service';

@Injectable()
export class BoardService {
  constructor(
    private dataSource: DataSource,
    private boardMapper: BoardMapper,
    private moveService: MoveService<BoardEntity>,
  ) {}

  /**
   * Получить список всех досок.
   * @returns список досок без вложенных колонок и задач (только title, description, order).
   * **/
  public async getBoards(): Promise<TBoardBase[]> {
    const { manager } = this.dataSource;

    const boards = await manager.find(BoardEntity, { order: { order: 'ASC' } });
    if (!boards.length) return [];

    return this.boardMapper.toModel(boards, { withRelations: false });
  }

  /**
   * Получить доску по id.
   * @param boardId - id доски.
   * @returns объект доски с вложенными колонками и задачами.
   * **/
  public async getBoardById(boardId: number): Promise<TBoard> {
    if (!boardId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);

    const { manager } = this.dataSource;

    const board = await manager.findOne(BoardEntity, {
      where: { id: boardId },
      relations: { columns: { issues: true } },
      order: { order: 'ASC', columns: { order: 'ASC', issues: { order: 'ASC' } } },
    });
    if (!board) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

    return this.boardMapper.toModel(board, { withRelations: true });
  }

  /**
   * Создать доску.
   * @param body - данные доски (title, description).
   * @returns объект созданной доски.
   * **/
  public async createBoard(body: TCreateBoard): Promise<TBoardBase> {
    if (!body) throw new WsException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const boardsCount = await manager.count(BoardEntity);

    const board = await manager.save(BoardEntity, {
      title: body.title,
      description: body.description ?? null,
      order: OrderUtility.calculateOrderByIndex(boardsCount),
      columns: cloneDeep(DEFAULT_COLUMNS),
    });
    if (!board?.id) throw new WsException(EXCEPTION_MESSAGES.createFailed);

    return this.boardMapper.toModel(board, { withRelations: false });
  }

  /**
   * Изменить порядок досок в "пространстве".
   * Правила перемещения:
   * - Должен быть указан только previousId или nextId, но не оба сразу.
   * - Если previousId - null - доска помещается в начало списка.
   * - Если nextId - null - доска помещается в конец списка.
   * - Если существует только одна доска, то она не может быть перемещена.
   * - Если при перемещении доски ее позиция не меняется, то доска не может быть перемещена.
   * @param boardId - id целевой (перемещаемой) доски.
   * @param body - параметры перемещения (previousId / nextId).
   * @returns стандартный успешный ответ.
   * **/
  public async moveBoard(boardId: number, body: TMoveParameters): Promise<TSuccessResponse> {
    if (!boardId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    return await manager.transaction(async transactionalManager => {
      const boards = await transactionalManager.find(BoardEntity, {
        order: { order: 'ASC' },
      });

      this.moveService.tryToMove(boards, boardId, body);
      await transactionalManager.save(BoardEntity, boards);

      return getSuccessResponse();
    });
  }

  /**
   * Обновить доску.
   * @param body - поля для обновления.
   * @returns объект обновленной доски.
   * **/
  public async updateBoard(body: TUpdateBoard): Promise<TBoardBase> {
    if (!body?.id) throw new WsException(EXCEPTION_MESSAGES.idNotFound);
    const { id, ...rest } = body;
    const { manager } = this.dataSource;

    const board = await manager.findOne(BoardEntity, { where: { id } });
    if (!board) throw new WsException(EXCEPTION_MESSAGES.notFound);

    const updatedBoard = await manager.save(Object.assign(board, rest));
    if (!updatedBoard) throw new WsException(EXCEPTION_MESSAGES.updateFailed);

    return this.boardMapper.toModel(updatedBoard, { withRelations: false });
  }

  /**
   * Удалить доску. После удаления нужно нормализовать order.
   * @param boardId - id доски.
   * @returns массив досок после reorder и ID удаленной доски (для оповещения всех подписчиков доски).
   * **/
  public async deleteBoard(boardId: number): Promise<TDeleteBoardEmitPayload> {
    if (!boardId) throw new WsException(EXCEPTION_MESSAGES.idNotFound);

    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const boards = await transactionalManager.find(BoardEntity, {
        order: { order: 'ASC' },
      });

      const target = boards.find(({ id }) => id === boardId);
      if (!target) throw new WsException(EXCEPTION_MESSAGES.notFound);

      const { affected } = await transactionalManager.delete(BoardEntity, { id: boardId });
      if (!affected || affected <= 0) throw new WsException(EXCEPTION_MESSAGES.deleteFailed);

      const withoutTarget = boards.filter(({ id }) => id !== boardId);
      this.moveService.resetOrders(withoutTarget);

      const boardsAfterDeleting = await transactionalManager.save(BoardEntity, withoutTarget);

      return {
        deletedBoardId: target.id,
        boards: this.boardMapper.toModel(boardsAfterDeleting, { withRelations: false }),
      };
    });
  }
}
