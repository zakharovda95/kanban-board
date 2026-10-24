import {
  AUTH_LOGIN_MAXLENGTH,
  AUTH_PASSWORD_MAXLENGTH,
  AUTH_PASSWORD_MINLENGTH,
  type TAuthData,
} from '@kanban-board/common';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';

export default class AuthLoginDto implements TAuthData {
  @IsString({ message: VALIDATION_MESSAGES.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @MaxLength(AUTH_LOGIN_MAXLENGTH, {
    message: `${VALIDATION_MESSAGES.maxlength} ${AUTH_LOGIN_MAXLENGTH}`,
  })
  login!: string;

  @IsString({ message: VALIDATION_MESSAGES.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @MaxLength(AUTH_PASSWORD_MAXLENGTH, {
    message: `${VALIDATION_MESSAGES.maxlength} ${AUTH_PASSWORD_MAXLENGTH}`,
  })
  @MinLength(AUTH_PASSWORD_MINLENGTH, {
    message: `${VALIDATION_MESSAGES.minlength} ${AUTH_PASSWORD_MINLENGTH}`,
  })
  password!: string;
}
