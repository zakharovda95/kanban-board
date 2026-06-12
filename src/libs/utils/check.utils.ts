export function isDefined<T>(value: T): value is T {
  return value !== undefined;
}

export function isNull(value: unknown): value is null {
  return value === null;
}
