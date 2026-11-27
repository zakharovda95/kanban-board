import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

/** Создать resolver route-param для третьего аргумента `@Can` (сырое значение до pipe). **/
export const param = (name: string) => (context: ExecutionContext) =>
  [context.switchToHttp().getRequest<Request>().params[name] as string] as const;

/**
 * Создать resolver WS payload для третьего аргумента `@Can` (сырое значение до pipe).
 * Без аргумента — весь payload, с именем поля — значение этого поля.
 **/
export const data = (field?: string) => (context: ExecutionContext) => {
  const payload = context.switchToWs().getData<unknown>();
  if (field === undefined) return [payload as string] as const;
  return [(payload as Record<string, unknown>)?.[field] as string] as const;
};
