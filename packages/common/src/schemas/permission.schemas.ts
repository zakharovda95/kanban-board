import { z } from 'zod';

import { VALIDATION_MESSAGES } from '../constants/exception.constants.js';
import {
  EBoardAccessPermissionField,
  EBoardPermissionField,
  EPermissionType,
  EProfilePermissionField,
} from '../enums/permission.enums.js';
import { positiveIdSchema } from './shared.schemas.js';

/** Схема валидации тела запроса на замену разрешения. **/
export const updatePermissionBodySchema = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal(EPermissionType.PROFILE),
    field: z.enum(EProfilePermissionField),
    value: z.boolean({ error: VALIDATION_MESSAGES.mustBeBoolean }),
  }),
  z.strictObject({
    type: z.literal(EPermissionType.BOARD),
    field: z.enum(EBoardPermissionField),
    value: z.boolean({ error: VALIDATION_MESSAGES.mustBeBoolean }),
  }),
  z.strictObject({
    type: z.literal(EPermissionType.BOARD_ACCESSES),
    field: z.enum(EBoardAccessPermissionField),
    value: z.boolean({ error: VALIDATION_MESSAGES.mustBeBoolean }),
    boardId: positiveIdSchema,
  }),
]);

/** Тип схемы валидации тела запроса на замену разрешения. **/
export type TUpdatePermissionBodySchema = z.infer<typeof updatePermissionBodySchema>;
