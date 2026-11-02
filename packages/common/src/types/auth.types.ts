import type { TAuthLoginBodySchema } from '../schemas/auth.schemas.js';
import type { TSuccessResponse } from './response.types.js';

/** Ответ со сгенерированными данными для авторизации. **/
export type TAuthRegisterResponse = TSuccessResponse<TAuthLoginBodySchema>;

/** ID пользователя, логин, пароль и хэш пароля. **/
export type TAuthCredentials = Partial<TAuthLoginBodySchema> & {
  userId: number;
  passwordHash: string;
};
