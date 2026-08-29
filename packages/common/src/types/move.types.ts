export interface IMovable {
  id: number;
  order: number;
}

export type TMoveParameters = {
  targetId: number;
  previousId?: number | null;
};

export type TMoveOptions = {
  /** Разрешает переместить объект, даже если он один в контейнере. **/
  allowForceMove?: boolean;
};
