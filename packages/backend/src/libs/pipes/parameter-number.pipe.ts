import type { TExecutionContextType } from '@kanban-board/common';
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  ParseIntPipe,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

/** Опциональные проверки. **/
export type TParameterNumberPipeOptions = Partial<{
  /** Разрешить значения больше 0. По умолчанию true. **/
  positive: boolean;
  /** Разрешить значения равные 0. По умолчанию true. **/
  zero: boolean;
  /** Разрешить значения меньше 0. По умолчанию true. **/
  negative: boolean;
}>;

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
  private readonly defaultOptions: TParameterNumberPipeOptions = {
    positive: true,
    zero: true,
    negative: true,
  };

  constructor(
    private context: TExecutionContextType = 'http',
    options?: TParameterNumberPipeOptions,
  ) {
    super({
      exceptionFactory: (): HttpException | WsException => this.getException(),
    });

    // Мержим опции, чтобы не перезаписались опции по умолчанию, если они не переданы явно.
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  /** Получить объект исключения в зависимости от контекста выполнения. **/
  private getException(): HttpException | WsException {
    switch (this.context) {
      case 'http':
        return new HttpException(
          'Числовой параметр запроса имеет недопустимое значение',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      case 'ws':
        return new WsException('Числовой параметр запроса имеет недопустимое значение');
    }
  }

  /** Добавляем опциональные валидации. **/
  override async transform(value: string, metadata: ArgumentMetadata) {
    const number = await super.transform(value, metadata);

    const { positive, negative, zero } = this.defaultOptions;

    const isNotValid =
      (!positive && number > 0) || (!zero && number === 0) || (!negative && number < 0);

    if (isNotValid) throw this.getException();

    return number;
  }
}
