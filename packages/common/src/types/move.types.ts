export interface IMovable {
  id: number;
  order: number;
}

export type TMoveOptions = {
  /** Разрешает переместить объект, даже если он один в контейнере. **/
  allowForceMove?: boolean;
};

export type TMoveResult = {
  isOrderWasNormalized: boolean;
};
