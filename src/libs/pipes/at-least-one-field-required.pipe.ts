import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';

@Injectable()
export class AtLeastOneFieldRequiredPipe<T> implements PipeTransform {
  constructor(private fields: Array<keyof T>) {}

  transform(value: T, _: ArgumentMetadata): T {
    const hasField = this.fields.some(field => value?.[field] !== undefined);
    if (!hasField) {
      throw new HttpException(
        EXCEPTION_MESSAGES.atLeastOneFieldRequired,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return value;
  }
}
