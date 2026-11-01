import { z } from 'zod';

import { VALIDATION_MESSAGES } from '../constants/exception.constants.js';
import { USER_FIRST_NAMES, USER_LAST_NAMES } from '../constants/user.constants.js';

/** Схема валидации обязательного положительного целочисленного идентификатора. **/
export const positiveIdSchema = z.coerce
  .number({
    error: iss =>
      iss.input === undefined || iss.input === null
        ? VALIDATION_MESSAGES.idRequired
        : VALIDATION_MESSAGES.idMustBeInteger,
  })
  .int({ error: VALIDATION_MESSAGES.idMustBeInteger })
  .positive({ error: VALIDATION_MESSAGES.idMustBePositive });

/** Тип схемы валидации обязательного положительного целочисленного идентификатора. **/
export type TPositiveIdSchema = z.infer<typeof positiveIdSchema>;

/** Схема валидации опционального положительного целочисленного идентификатора. **/
export const optionalPositiveIdSchema = z.coerce
  .number({ error: VALIDATION_MESSAGES.idMustBeInteger })
  .int({ error: VALIDATION_MESSAGES.idMustBeInteger })
  .positive({ error: VALIDATION_MESSAGES.idMustBePositive })
  .nullish();

/** Регулярное выражение для цвета в формате HEX (аналог IsHexColor). **/
export const HEX_COLOR_REGEX = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

/** Схема валидации цвета в формате HEX. **/
export const hexColorSchema = z
  .string({ error: VALIDATION_MESSAGES.mustBeHexColor })
  .regex(HEX_COLOR_REGEX, { error: VALIDATION_MESSAGES.mustBeHexColor });

export const firstNameSchema = z.enum(USER_FIRST_NAMES, { error: VALIDATION_MESSAGES.mustBeEnum });
export const lastNameSchema = z.enum(USER_LAST_NAMES, { error: VALIDATION_MESSAGES.mustBeEnum });
