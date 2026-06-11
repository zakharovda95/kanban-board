export function toMapBy<T, K extends keyof T>(collection: T[], key: K): Map<T[K], T> {
  return new Map(collection.map(collectionElement => [collectionElement[key], collectionElement]));
}
