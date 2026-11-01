import { z } from 'zod';

import { VALIDATION_MESSAGES } from '../constants/exception.constants.js';
import { USER_AVATARS } from '../constants/user.constants.js';
import { firstNameSchema, lastNameSchema } from './shared.schemas.js';

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
