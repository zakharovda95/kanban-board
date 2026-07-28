export interface IMovable {
  id: number;
  order: number;
}

export type TMoveParameters = {
  previousId?: number | null;
  nextId?: number | null;
};

export type TMoveOptions = {
  /** Разрешает переместить объект, даже если он один в контейнере. **/
  allowForceMove?: boolean;
};

export type TMoveDirection = 'previous' | 'next';
