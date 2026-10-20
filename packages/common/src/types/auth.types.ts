import type { TSuccessResponse } from './response.types.js';

/** Данные для авторизации. **/
export type TAuthData = {
  login: string;
  password: string;
};

/** Данные для регистрации (сгенерированные, не допускается ручной ввод). **/
export type TAuthRegister = {
  firstName: string;
  lastName: string;
};

/** Ответ со сгенерированными данными для авторизации. **/
export type TAuthRegisterResponse = TSuccessResponse<TAuthData>;

/** Токены аутентификации. **/
export type TAuthLoginPayload = {
  token: string;
};

/** Ответ с токеном после аутентификации. **/
export type TAuthLoginResponse = TSuccessResponse<TAuthLoginPayload>;
