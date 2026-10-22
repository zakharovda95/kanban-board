import { FILE_MIME_SIGNATURES, TEXT_FILE_FORMATS } from '../constants/file.constants.js';
import { TFileMimeType, TTextFileType } from '../types/file.types.js';

export class FileUtility {
  /** Возвращает Data URL файла в base64 кодировке **/
  public static async getFileAsBase64DataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
          return;
        }
        reject(new Error('Ошибка чтения файла'));
      };

      reader.onerror = () => {
        reject(reader.error ?? new Error('Ошибка чтения файла'));
      };
    });
  }

  /** Возвращает бинарные данные (сырые байты) файла в виде ArrayBuffer **/
  public static readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        reader.result instanceof ArrayBuffer
          ? resolve(reader.result)
          : reject(new Error('Ошибка чтения файла'));

      reader.onerror = reject;

      reader.readAsArrayBuffer(file);
    });
  }

  /** Получить MIME-тип файла по магическому числу. **/
  public static getFileMimeType(
    buffer: ArrayBuffer,
    fallback: TFileMimeType | null = null,
  ): TFileMimeType | null {
    const bytes = new Uint8Array(buffer, 0, 4);

    const header = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return FILE_MIME_SIGNATURES[header] ?? fallback;
  }

  /** Составить текстовый файл (txt, csv, json, html, md) из массива строк. **/
  public static buildTextFile(
    lines: string[],
    fileNameWithoutExtension: string,
    fileType: TTextFileType = 'TXT',
    lineSeparator: string = '\n',
  ): File {
    const resultText = lines.join(lineSeparator);
    const meta = TEXT_FILE_FORMATS[fileType];
    return new File([resultText], `${fileNameWithoutExtension}${meta.extension}`, {
      type: meta.mimeType,
    });
  }

  /** Скачать файл. **/
  public static downloadFile(file: File): void {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');

    link.href = url;
    link.download = file.name;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
