import { HttpException, HttpStatus, Injectable, ParseEnumPipe } from '@nestjs/common';

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
          'Параметр запроса имеет недопустимое значение',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    });
  }
}
