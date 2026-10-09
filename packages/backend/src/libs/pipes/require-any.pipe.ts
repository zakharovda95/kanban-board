import type { TExecutionContextType } from '@kanban-board/common';
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

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

  private getException(): HttpException | WsException {
    const fieldsList = this.fields.map(String).join(', ');
    const message = `Необходимо указать хотя бы одно из полей: ${fieldsList}`;

    switch (this.context) {
      case 'http':
        return new HttpException(message, HttpStatus.UNPROCESSABLE_ENTITY);
      case 'ws': {
        return new WsException(message);
      }
    }
  }

  public transform(object: T, _: ArgumentMetadata): T {
    const hasField = this.fields.some(field => object?.[field] != null);
    if (!hasField) throw this.getException();

    return object;
  }
}
