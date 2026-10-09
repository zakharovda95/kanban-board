/** Максимально допустимый размер файла. **/
export const STORAGE_MAX_FILE_SIZE = 500 * 1024;

/** Максимально допустимый количество файлов для одновременной загрузки. **/
export const STORAGE_MAX_FILES_COUNT = 3;

/** Максимальная длина ключа объекта. **/
export const STORAGE_OBJECT_KEY_MAXLENGTH = 256;

/** Максимальная длина имени объекта. **/
export const STORAGE_FILE_NAME_MAXLENGTH = 128;

/** TTL подписанного URL - 3 минуты более чем достаточно тк операции всегда идут программно. **/
export const STORAGE_PRESIGNED_URL_TTL = 3 * 60;
