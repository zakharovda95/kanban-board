import { HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';

export default class ParameterIdPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory: (): HttpException => {
        return new HttpException(
          VALIDATION_MESSAGES.idMustBeBigint,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    });
  }
}
