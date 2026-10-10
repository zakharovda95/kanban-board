/** Допустимый тип изображения для загрузки. **/
export type TImageMimeType = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp';

/** Допустимый тип файла для загрузки. Расширить при необходимости **/
export type TFileMimeType = TImageMimeType;

/** Файл с метаданными (без временного URL — его формирует клиент). **/
export type TFileData = {
  file: File;
  type: TFileMimeType | null;
  size: number;
  name: string;
};
