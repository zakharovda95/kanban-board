export type TBaseAction = 'update' | 'delete' | 'move';

export type TUpsertFormData = {
  title: string;
  description: string;
  color?: string;
};
