import type { TAuthLoginBodySchema } from '../schemas/auth.schemas.js';
import type { TSuccessResponse } from './response.types.js';

/** Ответ со сгенерированными данными для авторизации. **/
export type TAuthRegisterResponse = TSuccessResponse<TAuthLoginBodySchema>;

/** Ответ с токеном после аутентификации. **/
export type TAuthLoginResponse = TSuccessResponse<TAuthLoginPayload>;

/** Токены аутентификации. **/
export type TAuthLoginPayload = {
  token: string;
};
