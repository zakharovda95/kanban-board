import type { NextFunction, Request, Response } from 'express';

export default function loggerMiddleware(_: Request, __: Response, next: NextFunction): void {
  //TODO: реализовать логгер.
  next();
}
