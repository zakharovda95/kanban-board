import { z } from 'zod';

import {
  BOARD_DESCRIPTION_MAXLENGTH,
  BOARD_TITLE_MAXLENGTH,
} from '../constants/board.constants.js';
import { VALIDATION_MESSAGES } from '../constants/exception.constants.js';
import { positiveIdSchema } from './shared.schemas.js';

/** Схема валидации тела запроса создания доски. **/
export const createBoardBodySchema = z.strictObject({
  title: z
    .string({ error: VALIDATION_MESSAGES.mustBeString })
    .nonempty({ error: VALIDATION_MESSAGES.required })
    .max(BOARD_TITLE_MAXLENGTH, {
      error: VALIDATION_MESSAGES.maxLength(BOARD_TITLE_MAXLENGTH),
    }),
  description: z
    .string({ error: VALIDATION_MESSAGES.mustBeString })
    .max(BOARD_DESCRIPTION_MAXLENGTH, {
      error: VALIDATION_MESSAGES.maxLength(BOARD_DESCRIPTION_MAXLENGTH),
    })
    .nullish(),
});

/** Тип схемы валидации тела запроса создания доски. **/
export type TCreateBoardBodySchema = z.infer<typeof createBoardBodySchema>;

/** Схема валидации тела запроса обновления доски. **/
export const updateBoardBodySchema = createBoardBodySchema.partial().extend({
  id: positiveIdSchema,
});

/** Тип схемы валидации тела запроса обновления доски. **/
export type TUpdateBoardBodySchema = z.infer<typeof updateBoardBodySchema>;
