/**
 * Условная подпапка (часть objectKey s3-объекта) для загрузки файлов напрямую из backend.
 * Не для загрузки из приложения.
 * **/
export enum EStorageSubmodule {
  COMMON = 'common',
  ISSUE_ATTACHMENTS = 'issue-attachments',
}

/** Статусы загрузки файла в хранилище. **/
export enum EStorageUploadStatus {
  PENDING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  ERROR = 'ERROR',
}
