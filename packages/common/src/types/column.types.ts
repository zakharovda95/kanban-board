import type { TIssueBase } from './issue.types.js';
import type { IMovable, TMoveParameters } from './move.types.js';
import type { TSuccessResponse } from './response.types.js';

/** Базовые данные **/
export type TColumnBase = IMovable & {
  title: string;
  description: string | null;
  color: string;
  boardId: number;
};

/** Полные данные включая задачи. **/
export type TColumn = TColumnBase & {
  issues: TIssueBase[];
};

/** Тело запроса на создание колонки. **/
export type TCreateColumn = Pick<TColumnBase, 'title' | 'color' | 'boardId'> &
  Partial<Pick<TColumnBase, 'description'>>;

/** Тело запроса на обновление колонки. **/
export type TUpdateColumn = Pick<TColumnBase, 'id'> &
  Partial<Pick<TColumnBase, 'title' | 'description' | 'color'>>;

/** Тело запроса на перемещение колонки. **/
export type TMoveColumn = TMoveParameters & Pick<TColumnBase, 'boardId'>;

/** Ответ ack после создания колонки. **/
export type TCreateColumnResponse = TSuccessResponse<TColumn>;

/** Ответ ack после обновления колонки (без задач). **/
export type TUpdateColumnResponse = TSuccessResponse<TColumnBase>;

/** Ответ ack после удаления колонки. **/
export type TDeleteColumnResponse = TSuccessResponse<TDeleteColumnEmitPayload>;

/** Ответ ack после перемещения колонки. **/
export type TMoveColumnResponse = TSuccessResponse<TMoveColumnEmitPayload>;

/** Полезная нагрузка эмита удаления колонки. **/
export type TDeleteColumnEmitPayload = {
  boardId: number;
  deletedColumnId: number;
};

/** Полезная нагрузка эмита перемещения колонки. **/
export type TMoveColumnEmitPayload = {
  boardId: number;
  movedColumnId: number;
  /** Перемещенная колонка (без задач) или null, если был reorder всех колонок и нужно сделать refetch. **/
  movedColumn: TColumnBase | null;
};
