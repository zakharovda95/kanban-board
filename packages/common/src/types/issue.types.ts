import type { TColumn } from './column.types';
import type { IMovable, TMoveParameters } from './move.types.js';
import type { TSuccessResponse } from './response.types.js';

/** Базовые данные (для карточки) **/
export type TIssueBase = IMovable & {
  createdAt: Date;
  title: string;
  boardId: number;
  columnId: number;
};

/** Полные данные (детальная задачи). **/
export type TIssue = TIssueBase & {
  updatedAt: Date;
  description: string | null;
};

/** Тело запроса на создание задачи. **/
export type TCreateIssue = Pick<TIssue, 'boardId' | 'columnId' | 'title'> &
  Partial<Pick<TIssue, 'description'>>;

/** Тело запроса на обновление задачи. **/
export type TUpdateIssue = Pick<TIssueBase, 'id'> & Partial<Pick<TIssue, 'title' | 'description'>>;

/** Тело запроса на перемещение задачи. **/
export type TMoveIssue = TMoveParameters & {
  boardId: number;
  fromColumnId: number;
  toColumnId?: number;
};

/** Ответ ack после создания/обновления задачи. **/
export type TUpsertIssueResponse = TSuccessResponse<TIssueBase>;

/** Ответ ack после удаления задачи. **/
export type TDeleteIssueResponse = TSuccessResponse<TDeleteIssueEmitPayload>;

/** Ответ ack после перемещения задачи. **/
export type TMoveIssueResponse = TSuccessResponse<TMoveIssueEmitPayload>;

/** Полезная нагрузка эмита удаления задачи. **/
export type TDeleteIssueEmitPayload = {
  issues: TIssueBase[];
  boardId: number;
  columnId: number;
  deletedIssueId: number;
};

/** Полезная нагрузка эмита перемещения задачи. **/
export type TMoveIssueEmitPayload = {
  movedIssueId: number;
  boardId: number;
  columnId: number;
  column: TColumn;
};
