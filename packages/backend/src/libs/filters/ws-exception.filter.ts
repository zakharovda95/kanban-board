import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch(WsException)
export default class WsExceptionFilter implements ExceptionFilter {
  public catch(exception: WsException, host: ArgumentsHost) {
    const errorBody: unknown = exception.getError();

    const args = host.getArgs();
    const ack = args.find((arg): arg is (...args: unknown[]) => void => typeof arg === 'function');

    if (!ack) return;
    ack(errorBody);
  }
}
