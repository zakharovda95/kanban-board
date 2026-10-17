import { HttpException, HttpStatus, Injectable, ParseEnumPipe } from '@nestjs/common';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';

/**
 * Проверка на допустимое значение параметра строки запроса.
 * Расширяет встроенный ParseEnumPipe: заменяет текст ошибки на пользовательский тк нет опции для установки пользовательского текста ошибки.
 * **/
@Injectable()
export default class ParameterEnumPipe extends ParseEnumPipe {
  constructor(enumValue: Record<string, unknown>) {
    super(enumValue, {
      exceptionFactory: () => {
        return new HttpException(
          VALIDATION_MESSAGES.parameterWrongValue,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    });
  }
}
