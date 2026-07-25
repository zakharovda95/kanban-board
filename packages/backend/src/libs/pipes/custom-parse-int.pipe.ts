import { HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';

export default class CustomParseIntPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory: (): HttpException => {
        return new HttpException(
          VALIDATION_MESSAGES.idMustBeANumber,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    });
  }
}
