import { EErrorType } from '@kanban-board/common';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export default class WsExceptionFilter implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost): void {
    const args = host.getArgs<unknown[]>();
    const ack = [...args]
      .reverse()
      .find((arg): arg is (...payload: unknown[]) => void => typeof arg === 'function');

    if (!ack) return;
    ack(this.toErrorBody(exception));
  }

  private toErrorBody(exception: unknown): unknown {
    if (exception instanceof WsException) {
      return exception.getError();
    }

    if (exception instanceof HttpException) {
      return exception.getResponse();
    }

    if (exception instanceof Error) {
      return {
        statusCode: EErrorType.INTERNAL,
        message: exception.message || 'Внутренняя ошибка сервера',
      };
    }

    return {
      statusCode: EErrorType.INTERNAL,
      message: 'Внутренняя ошибка сервера',
    };
  }
}
