import type { NextFunction, Request, Response } from 'express';

export default function loggerMiddleware(
  _request: Request,
  _response: Response,
  _next: NextFunction,
): void {
  //TODO: реализовать логгер.;
}
