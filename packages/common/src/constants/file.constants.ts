import type { TFileMimeType, TImageMimeType } from '../types';

/** Словарь сигнатур (magic-number, первые 4 байта, определяющие тип изображения) типов изображений. **/
export const IMAGE_MIME_SIGNATURES: Record<string, TImageMimeType> = {
  '89504e47': 'image/png',
  '47494638': 'image/gif',
  'ffd8ffe0': 'image/jpeg',
  'ffd8ffe1': 'image/jpeg',
  'ffd8ffe2': 'image/jpeg',
  'ffd8ffe3': 'image/jpeg',
  'ffd8ffe8': 'image/jpeg',
};

/** Словарь сигнатур (magic-number, первые 4 байта, определяющие тип файла) типов файлов. **/
export const FILE_MIME_SIGNATURES: Record<string, TFileMimeType> = { ...IMAGE_MIME_SIGNATURES };

/** Массив MIME-типов изображений. **/
export const IMAGE_MIME_TYPES: TImageMimeType[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

/** Массив MIME-типов файлов. **/
export const FILE_MIME_TYPES: TFileMimeType[] = [...IMAGE_MIME_TYPES];

/** Дефолтный ContentType. **/
export const FILE_CONTENT_TYPE = 'application/octet-stream';
