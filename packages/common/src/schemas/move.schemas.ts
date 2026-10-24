import { z } from 'zod';

import { optionalPositiveIdSchema, positiveIdSchema } from './shared.schemas.js';

/** Схема валидации тела запроса с параметрами перемещения. **/
export const moveParametersBodySchema = z.strictObject({
  previousId: optionalPositiveIdSchema,
  targetId: positiveIdSchema,
});

/** Тип схемы валидации тела запроса с параметрами перемещения. **/
export type TMoveParametersBodySchema = z.infer<typeof moveParametersBodySchema>;
