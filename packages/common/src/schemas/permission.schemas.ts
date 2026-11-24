import { z } from 'zod';

import { VALIDATION_MESSAGES } from '../constants/exception.constants.js';
import {
  EBoardAccessPermissionType,
  EBoardPermissionType,
  EProfilePermissionType,
} from '../enums/permission.enums.js';
import { positiveIdSchema } from './shared.schemas.js';

/** Схема валидации тела запроса на замену разрешения. **/
export const updatePermissionBodySchema = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('profile'),
    field: z.enum(EProfilePermissionType),
    value: z.boolean({ error: VALIDATION_MESSAGES.mustBeBoolean }),
  }),
  z.strictObject({
    type: z.literal('board'),
    field: z.enum(EBoardPermissionType),
    value: z.boolean({ error: VALIDATION_MESSAGES.mustBeBoolean }),
  }),
  z.strictObject({
    type: z.literal('boardsAccesses'),
    field: z.enum(EBoardAccessPermissionType),
    value: z.boolean({ error: VALIDATION_MESSAGES.mustBeBoolean }),
    boardId: positiveIdSchema,
  }),
]);

/** Тип схемы валидации тела запроса на замену разрешения. **/
export type TUpdatePermissionBodySchema = z.infer<typeof updatePermissionBodySchema>;
