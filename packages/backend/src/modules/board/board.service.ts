import {
  BOARDS_MAX_COUNT,
  BOARDS_MAX_COUNT_ERROR_MESSAGE,
  type TBoard,
  type TBoardBase,
  type TCreateBoardBodySchema,
  type TDeleteBoardEmitPayload,
  type TMoveBoardEmitPayload,
  type TMoveParametersBodySchema,
  type TPositiveIdSchema,
  type TUpdateBoardBodySchema,
} from '@kanban-board/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { cloneDeep } from 'lodash';
import { DataSource } from 'typeorm';

import OrderUtility from '@/libs/utilities/order.utility';
import { TMaxOrderResult } from '@/libs/utilities/order.utility';
import BoardEntity from '@/modules/board/libs/entities/board.entity';
import BoardMapper from '@/modules/board/libs/mappers/board.mapper';
import { DEFAULT_COLUMNS } from '@/modules/column/libs/constants/column.constants';
import ColumnEntity from '@/modules/column/libs/entities/column.entity';
import IssueEntity from '@/modules/issue/libs/entities/issue.entity';
import MoveService from '@/modules/shared/move/move.service';

@Injectable()
export default class BoardService {
  constructor(
    private dataSource: DataSource,
    private boardMapper: BoardMapper,
    private moveService: MoveService<BoardEntity>,
  ) {}

  /**
   * Получить список всех досок.
   * @returns список досок без вложенных колонок и задач (только title, description, order).
   * **/
  public async getBoards(workspaceId: number): Promise<TBoardBase[]> {
    const { manager } = this.dataSource;

    const boards = await manager.find(BoardEntity, {
      where: { workspaceId },
      order: { order: 'ASC' },
    });

    return this.boardMapper.toModel(boards, { base: true });
  }

  /**
   * Получить доску по id.
   * @param boardId - id доски.
   * @returns объект доски с вложенными колонками и задачами.
   * **/
  public async getBoardById(boardId: TPositiveIdSchema): Promise<TBoard> {
    const { manager } = this.dataSource;

    const board = await manager.findOne(BoardEntity, {
      where: { id: boardId },
      relations: { columns: { issues: true } },
      order: { order: 'ASC', columns: { order: 'ASC', issues: { order: 'ASC' } } },
    });
    if (!board) throw new NotFoundException('Доска не найдена');

    return this.boardMapper.toModel(board, { base: false });
  }

  /**
   * Создать доску.
   * @param workspaceId - Id рабочего пространства, в котором создается доска.
   * @param body - данные доски (title, description).
   * @returns объект созданной доски.
   * **/
  public async createBoard(
    workspaceId: TPositiveIdSchema,
    body: TCreateBoardBodySchema,
  ): Promise<TBoardBase> {
    const { manager } = this.dataSource;

    return manager.transaction(async transactionalManager => {
      const DATABASE_LOCK_ID = 1000;
      // Блокируем доступ к базе данных для предотвращения одновременного создания нескольких досок.
      await transactionalManager.query('SELECT pg_advisory_xact_lock($1)', [DATABASE_LOCK_ID]);

      const boardsCount = await transactionalManager.count(BoardEntity, {
        where: { workspaceId },
      });
      if (boardsCount >= BOARDS_MAX_COUNT) throw new WsException(BOARDS_MAX_COUNT_ERROR_MESSAGE);

      // Получаем максимальный order внутри пространства, чтобы при создании прибавить ORDER_STEP
      const result = await transactionalManager
        .createQueryBuilder()
        .select('MAX(board.order)', 'maxOrder')
        .from(BoardEntity, 'board')
        .where('board.workspaceId = :workspaceId', { workspaceId })
        .getRawOne<TMaxOrderResult>();

      const newBoard = transactionalManager.create(BoardEntity, {
        title: body.title,
        description: body.description ?? null,
        order: OrderUtility.calculateNextOrder(result?.maxOrder ?? 0),
        columns: cloneDeep(DEFAULT_COLUMNS),
        workspaceId,
      });

      const createdBoard = await transactionalManager.save(newBoard);

      return this.boardMapper.toModel(createdBoard, { base: true });
    });
  }

  /**
   * Изменить порядок досок в пространстве. Порядок считается отдельно для каждого пространства.
   * Правила перемещения:
   * - Должен быть указан previousId - id доски после которой будет перемещаемая доска (может быть null).
   * - Если previousId - null - доска помещается в начало списка.
   * - Если существует только одна доска, то она не может быть перемещена.
   * - Если при перемещении доски ее позиция не меняется, то доска не может быть перемещена.
   * @param workspaceId - Id рабочего пространства, в котором меняется порядок.
   * @param body - параметры перемещения (targetId, previousId).
   * @returns объект перемещаемой доски, если order не был нормализован (точечная замена + сортировка по order на фронте, дешевле чем refetch), если был - null (если null - на фронте refetch досок этого пространства, т.к. меняется order всех его досок).
   * **/
  public async moveBoard(
    workspaceId: TPositiveIdSchema,
    body: TMoveParametersBodySchema,
  ): Promise<TMoveBoardEmitPayload> {
    const { manager } = this.dataSource;

    return await manager.transaction(async transactionalManager => {
      const boards = await transactionalManager.find(BoardEntity, {
        where: { workspaceId },
        order: { order: 'ASC' },
      });

      const moveResult = this.moveService.tryToMove(boards, body);
      await transactionalManager.save(BoardEntity, boards);

      let movedBoard: TBoardBase | null = null;

      if (!moveResult.isOrderWasNormalized) {
        const movedBoardEntity = await transactionalManager.findOne(BoardEntity, {
          where: { id: body.targetId, workspaceId },
        });
        if (movedBoardEntity)
          movedBoard = this.boardMapper.toModel(movedBoardEntity, { base: true });
      }

      return { movedBoard, movedBoardId: body.targetId };
    });
  }

  /**
   * Обновить доску.
   * @param body - поля для обновления.
   * @returns объект обновленной доски.
   * **/
  public async updateBoard(body: TUpdateBoardBodySchema): Promise<TBoardBase> {
    const { id, ...rest } = body;
    const { manager } = this.dataSource;

    const board = await manager.findOne(BoardEntity, { where: { id } });
    if (!board) throw new WsException('Доска для обновления не найдена');

    const updatedBoard = await manager.save(Object.assign(board, rest));

    return this.boardMapper.toModel(updatedBoard, { base: true });
  }

  /**
   * Удалить доску.
   * @param boardId - id доски.
   * @returns ID удаленной доски.
   * **/
  public async deleteBoard(boardId: TPositiveIdSchema): Promise<TDeleteBoardEmitPayload> {
    const { manager } = this.dataSource;

    const { affected } = await manager.delete(BoardEntity, { id: boardId });
    if (!affected || affected <= 0) throw new WsException('Не удалось удалить доску');

    return { deletedBoardId: boardId };
  }

  /**
   * Получить id доски по id колонки или задачи.
   * @param params - параметры поиска.
   * @returns id доски или null, если колонка или задача не найдена.
   * **/
  public async getBoardIdBy(params: {
    columnId: TPositiveIdSchema;
  }): Promise<TPositiveIdSchema | null>;
  public async getBoardIdBy(params: {
    issueId: TPositiveIdSchema;
  }): Promise<TPositiveIdSchema | null>;

  public async getBoardIdBy(
    params: { columnId: TPositiveIdSchema } | { issueId: TPositiveIdSchema },
  ): Promise<TPositiveIdSchema | null> {
    const { manager } = this.dataSource;

    if ('columnId' in params) {
      const column = await manager.findOne(ColumnEntity, {
        where: { id: params.columnId },
        select: { id: true, boardId: true },
      });
      return column?.boardId ?? null;
    }

    const issue = await manager.findOne(IssueEntity, {
      where: { id: params.issueId },
      select: { id: true, boardId: true },
    });
    return issue?.boardId ?? null;
  }
}
