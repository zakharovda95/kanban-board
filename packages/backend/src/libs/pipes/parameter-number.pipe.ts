import type { TExecutionContextType } from '@kanban-board/common';
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  ParseIntPipe,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';

/** Опциональные проверки. **/
export type TParameterNumberPipeOptions = {
  /** Разрешить значения больше 0. По умолчанию true. **/
  positive?: boolean;
  /** Разрешить значения равные 0. По умолчанию true. **/
  zero?: boolean;
  /** Разрешить значения меньше 0. По умолчанию true. **/
  negative?: boolean;
};

/**
 * Проверка на допустимое значение параметра строки запроса.
 * Расширяет встроенный ParseIntPipe:
 *  - заменяет текст ошибки на пользовательский тк нет опции для установки пользовательского текста ошибки;
 *  - добавляет дополнительные (опциональные) проверки на допустимые числовые значения (больше, меньше, равно);
 *  @param context - Контекст выполнения WebSocket или HTTP.
 *  @param options - Объект опций для дополнительных проверок.
 **/
@Injectable()
export default class ParameterNumberPipe extends ParseIntPipe {
  private readonly context: TExecutionContextType;
  private readonly defaultOptions: TParameterNumberPipeOptions = {
    positive: true,
    zero: true,
    negative: true,
  };

  constructor(context: TExecutionContextType = 'http', options?: TParameterNumberPipeOptions) {
    super({
      exceptionFactory: (): HttpException | WsException => {
        switch (this.context) {
          case 'http':
            return new HttpException(
              VALIDATION_MESSAGES.parameterWrongValue,
              HttpStatus.UNPROCESSABLE_ENTITY,
            );
          case 'ws':
            return new WsException(VALIDATION_MESSAGES.parameterWrongValue);
        }
      },
    });

    this.context = context;

    // Мержим опции, чтобы не перезаписались опции по умолчанию, если они не переданы явно.
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  /** Добавляем опциональные валидации. **/
  override async transform(value: string, metadata: ArgumentMetadata) {
    const number = await super.transform(value, metadata);

    const { positive, negative, zero } = this.defaultOptions;

    const isNotValid =
      (!positive && number > 0) || (!zero && number === 0) || (!negative && number < 0);

    if (this.context === 'http' && isNotValid) {
      throw new HttpException(
        VALIDATION_MESSAGES.parameterWrongValue,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (this.context === 'ws' && isNotValid) {
      throw new WsException(VALIDATION_MESSAGES.parameterWrongValue);
    }

    return number;
  }
}
