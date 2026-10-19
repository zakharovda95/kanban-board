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
