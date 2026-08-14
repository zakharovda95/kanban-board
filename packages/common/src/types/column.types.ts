import type { TIssueBase } from './issue.types.js';
import type { IMovable } from './move.types.js';
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

/** Ответ ack после создания/обновления колонки. **/
export type TUpsertColumnResponse = TSuccessResponse<TColumn>;

/** Ответ ack после удаления колонки. **/
export type TDeleteColumnResponse = TSuccessResponse<TDeleteColumnEmitPayload>;

/** Полезная нагрузка эмита удаления колонки. **/
export type TDeleteColumnEmitPayload = {
  columns: TColumn[];
  boardId: number;
  deletedColumnId: number;
};
