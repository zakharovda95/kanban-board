import { z } from 'zod';

import {
  COLUMN_DESCRIPTION_MAXLENGTH,
  COLUMN_TITLE_MAXLENGTH,
} from '../constants/column.constants.js';
import { VALIDATION_MESSAGES } from '../constants/exception.constants.js';
import { moveParametersBodySchema } from './move.schemas.js';
import { hexColorSchema, positiveIdSchema } from './shared.schemas.js';

/** Схема валидации тела запроса создания колонки. **/
export const createColumnBodySchema = z.strictObject({
  boardId: positiveIdSchema,
  title: z.string({ error: VALIDATION_MESSAGES.mustBeString }).max(COLUMN_TITLE_MAXLENGTH, {
    error: VALIDATION_MESSAGES.maxLength(COLUMN_TITLE_MAXLENGTH),
  }),
  description: z
    .string({ error: VALIDATION_MESSAGES.mustBeString })
    .max(COLUMN_DESCRIPTION_MAXLENGTH, {
      error: VALIDATION_MESSAGES.maxLength(COLUMN_DESCRIPTION_MAXLENGTH),
    })
    .nullish(),
  color: hexColorSchema,
});

/** Тип схемы валидации тела запроса создания колонки. **/
export type TCreateColumnBodySchema = z.infer<typeof createColumnBodySchema>;

/** Схема валидации тела запроса обновления колонки. **/
export const updateColumnBodySchema = createColumnBodySchema
  .omit({ boardId: true })
  .partial()
  .extend({
    id: positiveIdSchema,
  });

/** Тип схемы валидации тела запроса обновления колонки. **/
export type TUpdateColumnBodySchema = z.infer<typeof updateColumnBodySchema>;

/** Схема валидации тела запроса перемещения колонки. **/
export const moveColumnBodySchema = moveParametersBodySchema.extend({
  boardId: positiveIdSchema,
});

/** Тип схемы валидации тела запроса перемещения колонки. **/
export type TMoveColumnBodySchema = z.infer<typeof moveColumnBodySchema>;
