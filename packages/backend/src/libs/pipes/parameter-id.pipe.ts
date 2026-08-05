import type { TExecutionContextType } from '@kanban-board/common';
import { HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';

export default class ParameterIdPipe extends ParseIntPipe {
  constructor(context: TExecutionContextType = 'http') {
    super({
      exceptionFactory: (): HttpException | WsException => {
        switch (context) {
          case 'http':
            return new HttpException(
              VALIDATION_MESSAGES.idMustBeBigint,
              HttpStatus.UNPROCESSABLE_ENTITY,
            );
          case 'ws':
            return new WsException(VALIDATION_MESSAGES.idMustBeBigint);
        }
      },
    });
  }
}
