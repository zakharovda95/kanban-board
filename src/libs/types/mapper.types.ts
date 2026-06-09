export type TMapper<TEntity, TModel> = {
  toModel(entity: TEntity): TModel;
  toModel(entity: TEntity[]): TModel[];
};
