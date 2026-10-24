import type { TExecutionContextType } from '@kanban-board/common';
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

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
            'Необходимо указать хотя бы одно из допустимых полей',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        case 'ws': {
          throw new WsException('Необходимо указать хотя бы одно из допустимых полей');
        }
      }
    }

    return object;
  }
}
