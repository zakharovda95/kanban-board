import { z } from 'zod';

import { VALIDATION_MESSAGES } from '../constants/exception.constants.js';
import { ISSUE_TITLE_MAXLENGTH } from '../constants/issue.constants.js';
import { moveParametersBodySchema } from './move.schemas.js';
import { optionalPositiveIdSchema, positiveIdSchema } from './shared.schemas.js';

/** Схема валидации тела запроса создания задачи. **/
export const createIssueBodySchema = z.strictObject({
  boardId: positiveIdSchema,
  columnId: positiveIdSchema,
  title: z.string({ error: VALIDATION_MESSAGES.mustBeString }).max(ISSUE_TITLE_MAXLENGTH, {
    error: VALIDATION_MESSAGES.maxLength(ISSUE_TITLE_MAXLENGTH),
  }),
  description: z.string({ error: VALIDATION_MESSAGES.mustBeString }).nullish(),
});

/** Тип схемы валидации тела запроса создания задачи. **/
export type TCreateIssueBodySchema = z.infer<typeof createIssueBodySchema>;

/** Схема валидации тела запроса обновления задачи. **/
export const updateIssueBodySchema = createIssueBodySchema
  .pick({ title: true, description: true })
  .partial()
  .extend({
    id: positiveIdSchema,
  });

/** Тип схемы валидации тела запроса обновления задачи. **/
export type TUpdateIssueBodySchema = z.infer<typeof updateIssueBodySchema>;

/** Схема валидации тела запроса перемещения задачи. **/
export const moveIssueBodySchema = moveParametersBodySchema.extend({
  toColumnId: optionalPositiveIdSchema,
  boardId: positiveIdSchema,
  fromColumnId: positiveIdSchema,
});

/** Тип схемы валидации тела запроса перемещения задачи. **/
export type TMoveIssueBodySchema = z.infer<typeof moveIssueBodySchema>;
