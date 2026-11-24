import { z } from 'zod';

import { VALIDATION_MESSAGES } from '../constants/exception.constants.js';
import { USER_AVATARS } from '../constants/user.constants.js';
import {
  EBoardAccessUserPermissionType,
  EBoardUserPermissionType,
  EProfileUserPermissionType,
} from '../enums/user.enums.js';
import { firstNameSchema, lastNameSchema, positiveIdSchema } from './shared.schemas.js';

/** Схема валидации тела запроса на обновление информации о пользователе. **/
export const updateUserBodySchema = z
  .strictObject({
    avatar: z.enum(USER_AVATARS, { error: VALIDATION_MESSAGES.mustBeEnum }).nullish(),
    firstName: firstNameSchema.optional(),
    lastName: lastNameSchema.optional(),
  })
  .refine(data => data.avatar !== undefined || data.firstName || data.lastName, {
    message: VALIDATION_MESSAGES.atLeastOneFieldRequired,
  });

/** Тип схемы валидации тела запроса на обновление информации о пользователе. **/
export type TUpdateUserBodySchema = z.infer<typeof updateUserBodySchema>;

/** Схема валидации тела запроса на замену конкретного разрешения пользователя. **/
export const updateUserPermissionBodySchema = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('profile'),
    field: z.enum(EProfileUserPermissionType),
    value: z.boolean({ error: VALIDATION_MESSAGES.mustBeBoolean }),
  }),
  z.strictObject({
    type: z.literal('board'),
    field: z.enum(EBoardUserPermissionType),
    value: z.boolean({ error: VALIDATION_MESSAGES.mustBeBoolean }),
  }),
  z.strictObject({
    type: z.literal('boardsAccesses'),
    field: z.enum(EBoardAccessUserPermissionType),
    value: z.boolean({ error: VALIDATION_MESSAGES.mustBeBoolean }),
    boardId: positiveIdSchema,
  }),
]);

/** Тип схемы валидации тела запроса на замену набора разрешений пользователя. **/
export type TUpdateUserPermissionBodySchema = z.infer<typeof updateUserPermissionBodySchema>;
