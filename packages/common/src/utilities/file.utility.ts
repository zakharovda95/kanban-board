import { FILE_MIME_SIGNATURES } from '../constants';
import type { TFileMimeType } from '../types';

export class FileUtility {
  public static async readFileAsDataUrl(file: File): Promise<string> {
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

  public static buildMimeTypeRegExp(mimeTypes: TFileMimeType[]): RegExp {
    const pattern = mimeTypes
      .map(mimeType => mimeType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    return new RegExp(`^(${pattern})$`);
  }
}
