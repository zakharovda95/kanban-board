import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';

@Injectable()
export class RequireAnyPipe<T> implements PipeTransform {
  constructor(private fields: Array<keyof T>) {}

  transform(object: T, _: ArgumentMetadata): T {
    const hasField = this.fields.some(field => object?.[field] !== undefined);
    if (!hasField) {
      throw new HttpException(
        EXCEPTION_MESSAGES.atLeastOneFieldRequired,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return object;
  }
}
