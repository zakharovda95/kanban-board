import type { TColumn } from './column.types.js';
import type { IMovable } from './move.types.js';
import { TSuccessResponse } from './response.types';

/** Базовые данные для бокового меню **/
export type TBoardBase = IMovable & {
  title: string;
  description: string | null;
};

/** Полные данные включая колонки (для getByID) **/
export type TBoard = TBoardBase & {
  columns: TColumn[];
};

/** Тело запроса на создание доски. **/
export type TCreateBoard = Pick<TBoardBase, 'title'> & Partial<Pick<TBoardBase, 'description'>>;

/** Тело запроса на обновление доски. **/
export type TUpdateBoard = Pick<TBoardBase, 'id'> &
  Partial<Pick<TBoardBase, 'title' | 'description'>>;

/** Ответ после создания доски. **/
export type TCreateBoardResponse = TSuccessResponse<Pick<TBoardBase, 'id'>>;

/** Обновленный список досок и ID удаленной доски (чтобы перенаправить подписчиков, если активная доска больше не доступна). **/
export type TDeleteBoardEmitPayload = {
  boards: TBoardBase[];
  deletedBoardId: number;
};
