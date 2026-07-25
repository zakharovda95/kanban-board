import { HttpException, HttpStatus, ParseUUIDPipe } from '@nestjs/common';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';

export default class GuidPipe extends ParseUUIDPipe {
  constructor() {
    super({
      exceptionFactory: (): HttpException => {
        return new HttpException(
          VALIDATION_MESSAGES.idMustBeAGuid,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    });
  }
}
