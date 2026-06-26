import type {
  TBoard,
  TBoardBase,
  TCreateBoard,
  TCreateBoardResponse,
  TMoveParameters,
  TPatchBoard,
  TSuccessResponse,
} from '@kanban-board/common';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import { OrderUtility } from '@/libs/utilities/order.utility';
import {
  getSuccessResponse,
  getSuccessResponseWithData,
} from '@/libs/utilities/response.utilities';
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
    return this.boardMapper.toModel(boards);
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
   * @returns стандартный успешный ответ с id созданной доски.
   * **/
  public async createBoard(body: TCreateBoard): Promise<TCreateBoardResponse> {
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const boardsCount = await manager.count(BoardEntity);

    const { id } = await manager.save(BoardEntity, {
      title: body.title,
      description: body.description ?? null,
      order: OrderUtility.calculateOrderByIndex(boardsCount),
      columns: cloneDeep(DEFAULT_COLUMNS),
    });
    if (!id) throw new InternalServerErrorException(EXCEPTION_MESSAGES.createFailed);

    return getSuccessResponseWithData({ id });
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
   * Частично обновить доску.
   * @param boardId - id доски.
   * @param body - поля для обновления.
   * @returns стандартный успешный ответ.
   * **/
  public async patchBoard(boardId: number, body: TPatchBoard): Promise<TSuccessResponse> {
    if (!boardId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const board = await manager.findOne(BoardEntity, { where: { id: boardId } });
    if (!board) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

    await manager.save(Object.assign(board, body));

    return getSuccessResponse();
  }

  /**
   * Удалить доску.
   * @param boardId - id доски.
   * @returns стандартный успешный ответ.
   * **/
  public async deleteBoard(boardId: number): Promise<TSuccessResponse> {
    if (!boardId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);

    const { manager } = this.dataSource;

    const { affected } = await manager.delete(BoardEntity, { id: boardId });
    if (!affected || affected <= 0)
      throw new InternalServerErrorException(EXCEPTION_MESSAGES.deleteFailed);

    return getSuccessResponse();
  }
}
