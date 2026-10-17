import type { TImageMimeType } from '~/types/ui.types.ts';

export class ImageUtility {
  private static IMAGE_MIME_SIGNATURES: Record<string, TImageMimeType> = {
    '89504e47': 'image/png',
    '47494638': 'image/gif',
    'ffd8ffe0': 'image/jpeg',
    'ffd8ffe1': 'image/jpeg',
    'ffd8ffe2': 'image/jpeg',
    'ffd8ffe3': 'image/jpeg',
    'ffd8ffe8': 'image/jpeg',
  };

  private static IMAGE_MIME_TYPES: TImageMimeType[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  public static get imageMimeSignatures(): Record<string, TImageMimeType> {
    return this.IMAGE_MIME_SIGNATURES;
  }

  public static get imageMimeTypes(): TImageMimeType[] {
    return this.IMAGE_MIME_TYPES;
  }

  public static async readImageAsDataUrl(file: File): Promise<string> {
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

  public static readImageAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => (reader.result instanceof ArrayBuffer ? resolve(reader.result) : reject());
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  public static getImageMimeType(buffer: ArrayBuffer, fallback: TImageMimeType | null = null): TImageMimeType | null {
    const bytes = new Uint8Array(buffer, 0, 4);

    const header = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return this.IMAGE_MIME_SIGNATURES[header] ?? fallback;
  }
}
