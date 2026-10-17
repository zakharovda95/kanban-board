import type { TExecutionContextType } from '@kanban-board/common';
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';

/**
 * Проверка присутствует ли в объекте хотя бы одно поле из заданных.
 * @param fields - массив из ключей объекта, хотя бы одно поле из этого списка должно присутствовать в объекте.
 * @param context - контекст выполнения WebSocket или HTTP. Формируется исключение соответствующего типа.
 * **/
@Injectable()
export default class RequireAnyPipe<T> implements PipeTransform {
  constructor(
    private fields: Array<keyof T>,
    private context: TExecutionContextType = 'http',
  ) {}

  transform(object: T, _: ArgumentMetadata): T {
    const hasField = this.fields.some(field => object?.[field] != null);
    if (!hasField) {
      switch (this.context) {
        case 'http':
          throw new HttpException(
            EXCEPTION_MESSAGES.atLeastOneFieldRequired,
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        case 'ws': {
          throw new WsException(EXCEPTION_MESSAGES.atLeastOneFieldRequired);
        }
      }
    }

    return object;
  }
}
