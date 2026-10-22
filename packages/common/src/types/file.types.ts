/** Допустимый тип изображения для загрузки. **/
export type TImageMimeType = 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp';

/** Допустимый тип файла для загрузки. Расширить при необходимости **/
export type TFileMimeType = TImageMimeType;

/** Допустимые форматы текстовых файлов. **/
export type TTextFileType = 'TXT' | 'CSV' | 'JSON' | 'HTML' | 'MD';

/** MIME-типы текстовых файлов. **/
export type TTextFileMimeType =
  | 'text/plain;charset=utf-8'
  | 'text/csv;charset=utf-8'
  | 'application/json;charset=utf-8'
  | 'text/html;charset=utf-8'
  | 'text/markdown;charset=utf-8';

/** Расширения текстовых файлов. **/
export type TTextFileExtension = '.txt' | '.csv' | '.json' | '.html' | '.md';

/** Объект, содержащий основные мета данные текстового файла. **/
export type TFileFormat = {
  mimeType: TTextFileMimeType;
  extension: TTextFileExtension;
};
