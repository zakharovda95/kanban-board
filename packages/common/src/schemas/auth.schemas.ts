import { z } from 'zod';

import {
  AUTH_LOGIN_MAXLENGTH,
  AUTH_PASSWORD_MAXLENGTH,
  AUTH_PASSWORD_MINLENGTH,
} from '../constants/auth.constants.js';
import { VALIDATION_MESSAGES } from '../constants/exception.constants.js';
import {
  USER_FIRST_NAME_MAXLENGTH,
  USER_LAST_NAME_MAXLENGTH,
} from '../constants/user.constants.js';

/** Схема валидации тела запроса аутентификации пользователя. **/
export const authLoginBodySchema = z.strictObject({
  login: z
    .string({ error: VALIDATION_MESSAGES.mustBeString })
    .nonempty({ error: VALIDATION_MESSAGES.required })
    .max(AUTH_LOGIN_MAXLENGTH, { error: VALIDATION_MESSAGES.maxLength(AUTH_LOGIN_MAXLENGTH) }),
  password: z
    .string({ error: VALIDATION_MESSAGES.mustBeString })
    .nonempty({ error: VALIDATION_MESSAGES.required })
    .min(AUTH_PASSWORD_MINLENGTH, {
      error: VALIDATION_MESSAGES.minLength(AUTH_PASSWORD_MINLENGTH),
    })
    .max(AUTH_PASSWORD_MAXLENGTH, {
      error: VALIDATION_MESSAGES.maxLength(AUTH_PASSWORD_MAXLENGTH),
    }),
});

/** Тип схемы валидации тела запроса аутентификации пользователя. **/
export type TAuthLoginBodySchema = z.infer<typeof authLoginBodySchema>;

/** Схема валидации тела запроса регистрации нового пользователя. **/
export const authRegisterBodySchema = z.strictObject({
  firstName: z
    .string({ error: VALIDATION_MESSAGES.mustBeString })
    .nonempty({ error: VALIDATION_MESSAGES.required })
    .max(USER_FIRST_NAME_MAXLENGTH, {
      error: VALIDATION_MESSAGES.maxLength(USER_FIRST_NAME_MAXLENGTH),
    }),
  lastName: z
    .string({ error: VALIDATION_MESSAGES.mustBeString })
    .nonempty({ error: VALIDATION_MESSAGES.required })
    .max(USER_LAST_NAME_MAXLENGTH, {
      error: VALIDATION_MESSAGES.maxLength(USER_LAST_NAME_MAXLENGTH),
    }),
});

/** Тип схемы валидации тела запроса регистрации нового пользователя. **/
export type TAuthRegisterBodySchema = z.infer<typeof authRegisterBodySchema>;
