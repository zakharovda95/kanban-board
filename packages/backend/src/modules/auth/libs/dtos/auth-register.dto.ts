import {
  type TAuthRegister,
  USER_FIRST_NAME_MAXLENGTH,
  USER_LAST_NAME_MAXLENGTH,
} from '@kanban-board/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';

export default class AuthRegisterDto implements TAuthRegister {
  @IsString({ message: VALIDATION_MESSAGES.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @MaxLength(USER_FIRST_NAME_MAXLENGTH, {
    message: `${VALIDATION_MESSAGES.maxlength} ${USER_FIRST_NAME_MAXLENGTH}`,
  })
  firstName!: string;

  @IsString({ message: VALIDATION_MESSAGES.isString })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.required })
  @MaxLength(USER_LAST_NAME_MAXLENGTH, {
    message: `${VALIDATION_MESSAGES.maxlength} ${USER_LAST_NAME_MAXLENGTH}`,
  })
  lastName!: string;
}
