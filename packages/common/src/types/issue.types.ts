import type { IMovable } from './move.types.js';
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

/** Ответ ack после создания/обновления задачи. **/
export type TUpsertIssueResponse = TSuccessResponse<TIssueBase>;

/** Ответ ack после удаления задачи. **/
export type TDeleteIssueResponse = TSuccessResponse<TDeleteIssueEmitPayload>;

/** Ответ ack после перемещения задачи. **/
export type TMoveIssueResponse = TSuccessResponse<TMoveIssueEmitPayload>;

/** Полезная нагрузка эмита удаления задачи. **/
export type TDeleteIssueEmitPayload = {
  boardId: number;
  columnId: number;
  deletedIssueId: number;
};

/** Полезная нагрузка эмита перемещения задачи. **/
export type TMoveIssueEmitPayload = {
  boardId: number;
  movedIssueId: number;
  columnIdFrom: number;
  columnIdTo: number;
  /** Перемещенная задача (без колонки) или null, если был reorder всех задач и нужно сделать refetch. **/
  movedIssue: TIssueBase | null;
};
