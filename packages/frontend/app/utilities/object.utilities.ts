/**
 * Удалить пустые значения из объекта formData, чтобы получить ошибки валидации, если нужно.
 * **/
export function toBody<T>(object: T): Partial<T> | null {
  if (!object || !Object.keys(object).length) return null;

  const entries = Object.entries(object).filter(([_, value]) => {
    if (value === null || value === undefined || value === '') return false;
    if (typeof value === 'number' && Number.isNaN(value)) return false;

    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value as object).length > 0;

    return true;
  });

  return entries.length > 0 ? (Object.fromEntries(entries) as Partial<T>) : null;
}
