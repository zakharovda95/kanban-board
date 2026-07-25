export interface IMovable {
  id: string;
  order: number;
}

export type TMoveParameters = {
  previousId?: string | null;
  nextId?: string | null;
};

export type TMoveOptions = {
  /** Разрешает переместить объект, даже если он один в контейнере. **/
  allowForceMove?: boolean;
};

export type TMoveDirection = 'previous' | 'next';
