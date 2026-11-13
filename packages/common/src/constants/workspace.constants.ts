export const WORKSPACE_OWNERS_MAX_COUNT = 1;
export const WORKSPACE_USERS_MAX_COUNT = 5;
export const WORKSPACE_USERS_MAX_COUNT_ERROR_MESSAGE = `Нельзя пригласить более ${WORKSPACE_USERS_MAX_COUNT} пользователей в одно рабочее пространство`;

/**
 * Срок жизни инвайт-ссылки.
 * По истечению срока ссылка становится невалидной.
 * **/
export const WORKSPACE_INVITE_LINK_EXPIRE_HOURS = 4;

/**
 * Срок жизни аккаунта (рабочего пространства, юзера, данных и тд) в днях.
 * По истечению срока все данные удаляются.
 * **/
export const WORKSPACE_EXPIRES_DAYS = 7;

/** Максимальная длина названия приглашения в пространство. **/
export const WORKSPACE_INVITE_NAME_MAXLENGTH = 24;
