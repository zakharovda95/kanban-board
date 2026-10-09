import type { TFileMimeType } from './file.types.js';

/** Базовый тип инициализации загрузки файла в хранилище. **/
type TStorageUploadBase = {
  /** Идентификатор, сгенерированный на frontend для сопоставления метаданных с файлом, при загрузке нескольких файлов одновременно **/
  clientId: string;
};

/** Метаданные для инициализации загрузки файла в хранилище. **/
export type TStorageUploadMeta = TStorageUploadBase & {
  fileName: string;
  mimeType: TFileMimeType;
  size: number;
};

/** Метаданные для загрузки файла в хранилище. **/
export type TStorageUploadData = TStorageUploadBase & {
  attachmentId: string;
  uploadUrl: string;
};
