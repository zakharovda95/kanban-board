import type { TPositiveIdSchema } from '@kanban-board/common';

/**
 * Привести сырое значение ID к положительному целому ID.
 * @param value - сырое значение.
 * @returns ID или null, если значение невалидно.
 **/
export function parsePositiveId(value: unknown): TPositiveIdSchema | null {
  const id = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}
