export function isDefined<T>(value: T): value is T {
  return value !== undefined;
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function objectHasValues(target: object): boolean {
  return Object.values(target).some(value => isDefined(value));
}
