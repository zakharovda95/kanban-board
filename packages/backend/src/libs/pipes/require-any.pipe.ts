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

@Injectable()
export class RequireAnyPipe<T> implements PipeTransform {
  constructor(
    private fields: Array<keyof T>,
    private context: TExecutionContextType = 'http',
  ) {}

  transform(object: T, _: ArgumentMetadata): T {
    const hasField = this.fields.some(field => object?.[field] !== undefined);
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
