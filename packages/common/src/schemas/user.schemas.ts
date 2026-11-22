import { z } from 'zod';

import { BOARD_TITLE_MAXLENGTH } from '../constants/board.constants.js';
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

const booleanSchema = z.boolean({ error: VALIDATION_MESSAGES.mustBeBoolean });

/** Поля формы разрешений по типу. **/
const permissionFieldsSchema = <const T extends string>(types: readonly T[]) =>
  z.strictObject(
    Object.fromEntries(types.map(type => [type, booleanSchema])) as {
      [K in T]: typeof booleanSchema;
    },
  );

/** Схема валидации тела запроса на замену набора разрешений пользователя. **/
export const updateUserPermissionsBodySchema = z
  .strictObject({
    profile: permissionFieldsSchema(Object.values(EProfileUserPermissionType)),
    board: permissionFieldsSchema(Object.values(EBoardUserPermissionType)),
    boardsAccesses: z.array(
      z.strictObject({
        id: positiveIdSchema,
        title: z
          .string({ error: VALIDATION_MESSAGES.mustBeString })
          .nonempty({ error: VALIDATION_MESSAGES.required })
          .max(BOARD_TITLE_MAXLENGTH, {
            error: VALIDATION_MESSAGES.maxLength(BOARD_TITLE_MAXLENGTH),
          }),
        permissions: permissionFieldsSchema(Object.values(EBoardAccessUserPermissionType)),
      }),
    ),
  })
  .refine(
    data =>
      new Set(data.boardsAccesses.map(access => access.id)).size === data.boardsAccesses.length,
    {
      message: 'Доски в наборе разрешений не должны повторяться',
      path: ['boardsAccesses'],
    },
  );

/** Тип схемы валидации тела запроса на замену набора разрешений пользователя. **/
export type TUpdateUserPermissionsBodySchema = z.infer<typeof updateUserPermissionsBodySchema>;
