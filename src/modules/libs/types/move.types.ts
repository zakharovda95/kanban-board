export type TMovable = {
  id: number;
  order: number;
};

export type TMoveParameters = {
  previousId?: number | null;
  nextId?: number | null;
};

export type TMoveDirection = 'previous' | 'next';
