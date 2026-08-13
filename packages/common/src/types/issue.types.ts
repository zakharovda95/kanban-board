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

/** Тело запроса на создание задачи. **/
export type TUpdateIssue = Pick<TIssueBase, 'id'> & Partial<Pick<TIssue, 'title' | 'description'>>;

/** Ответ ack после создания/обновления задачи. **/
export type TUpsertIssueResponse = TSuccessResponse<TIssueBase>;

/** Ответ ack после удаления задачи. **/
export type TDeleteIssueResponse = TSuccessResponse<TDeleteIssueEmitPayload>;

/** Полезная нагрузка эмита удаления задачи. **/
export type TDeleteIssueEmitPayload = {
  issues: TIssueBase[];
  deletedIssueId: number;
};

export type TMoveIssue = TMoveParameters & { toColumnId?: number };
