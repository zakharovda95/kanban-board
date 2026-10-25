import type { TColumn } from './column.types.js';
import type { IMovable } from './move.types.js';
import type { TSuccessResponse } from './response.types.js';

/** Базовые данные для бокового меню. **/
export type TBoardBase = IMovable & {
  title: string;
  description: string | null;
};

/** Полные данные включая колонки (для getByID). **/
export type TBoard = TBoardBase & {
  columns: TColumn[];
};

/** Ответ ack после создания/обновления доски. **/
export type TUpsertBoardResponse = TSuccessResponse<TBoardBase>;

/** Ответ ack после удаления доски. **/
export type TDeleteBoardResponse = TSuccessResponse<TDeleteBoardEmitPayload>;

/** Ответ ack после перемещения доски. **/
export type TMoveBoardResponse = TSuccessResponse<TMoveBoardEmitPayload>;

/** Полезная нагрузка эмита удаления доски. **/
export type TDeleteBoardEmitPayload = {
  deletedBoardId: number;
};

/** Полезная нагрузка эмита перемещения доски. **/
export type TMoveBoardEmitPayload = {
  movedBoardId: number;
  /** Если была нормализация order - отправляем null. Если null - делаем refetch c фронта. **/
  movedBoard: TBoardBase | null;
};
