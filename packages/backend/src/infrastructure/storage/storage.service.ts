import { randomUUID } from 'node:crypto';
import { basename } from 'node:path';

import {
  EStorageSubmodule,
  STORAGE_PRESIGNED_URL_TTL,
  type TFileMimeType,
} from '@kanban-board/common';
import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

/**
 * https://docs.min.io/aistor/developers/sdk/javascript/api/
 * https://habr.com/ru/articles/514948/
 * Объектное (S3) хранилище MinIO.
 * **/
@Injectable()
export default class StorageService {
  private readonly passKey: string;
  private readonly client: Minio.Client;
  private readonly bucket: string;

  constructor(private configService: ConfigService) {
    this.passKey = this.configService.getOrThrow<string>('SUPER_AWESOME_PASS_KEY');
    this.bucket = this.configService.getOrThrow<string>('MINIO_BUCKET');
    this.client = new Minio.Client({
      endPoint: this.configService.getOrThrow<string>('MINIO_HOST'),
      port: this.configService.getOrThrow<number>('MINIO_PORT'),
      accessKey: this.configService.getOrThrow<string>('MINIO_USER'),
      secretKey: this.configService.getOrThrow<string>('MINIO_PASSWORD'),
      useSSL: false,
    });
  }

  /**
   * Формирует ключ файла (путь).
   * Если передан файл - формируется ключ объекта (для загрузки файла в хранилище через метод сервиса).
   * Если передано название файла - формируется путь для загрузки файла через подписанный URL (общий вариант использования).
   * @param submodule - условная "подпапка", из доступных для загрузки.
   * @param file - бинарный файл или строковое имя файла.
   * @returns objectKey загруженного файла.
   * **/
  public buildObjectKey(submodule: EStorageSubmodule, file: Express.Multer.File): string;
  public buildObjectKey(submodule: EStorageSubmodule, fileName: string): string;
  public buildObjectKey(
    submodule: EStorageSubmodule | null | undefined,
    fileOrName: Express.Multer.File | string,
  ): string {
    const buildObjectKey = (_fileName: string): string => {
      const safeName = _fileName.replace(/[^\w.-]+/g, '_');
      return `${submodule}/${Date.now()}-${randomUUID()}-${safeName}`;
    };

    if (typeof fileOrName === 'string') return buildObjectKey(fileOrName);
    return buildObjectKey(fileOrName.originalname);
  }

  /**
   * Формирует подписанный URL для загрузки файла через интерфейс приложения.
   * Content-Type включается в подпись: клиент обязан отправить тот же MIME-тип в заголовке PUT.
   * @param objectKey - ключ объекта в хранилище.
   * @param contentType - ожидаемый MIME-тип загружаемого файла.
   * @returns подписанный URL для HTTP PUT.
   * **/
  public async getUploadUrl(objectKey: string, contentType: TFileMimeType): Promise<string> {
    return this.client.presignedUrl('PUT', this.bucket, objectKey, STORAGE_PRESIGNED_URL_TTL, {
      'Content-Type': contentType,
    });
  }

  /**
   * Чтение файла из хранилища.
   * Метод используется для чтения файла напрямую через бэкенд. Требуется SUPER_AWESOME_PASS_KEY.
   * Для общих случаев загрузки использовать методы сервисов соответствующих модулей.
   * @param objectKey - ключ файла.
   * @param passKey - ключ доступа SUPER_AWESOME_PASS_KEY.
   * @returns байт-стрим запрашиваемого файла.
   * **/
  public async getFile(objectKey: string, passKey: string): Promise<StreamableFile> {
    if (!passKey || passKey !== this.passKey)
      throw new BadRequestException(
        'Недостаточно прав для чтения файла из объектного хранилища: передан неверный ключ доступа',
      );

    const [stat, stream] = await Promise.all([
      this.client.statObject(this.bucket, objectKey),
      this.client.getObject(this.bucket, objectKey),
    ]);

    const contentType =
      typeof stat.metaData['content-type'] === 'string'
        ? stat.metaData['content-type']
        : 'application/octet-stream';

    return new StreamableFile(stream, {
      type: contentType,
      length: stat.size,
      disposition: `inline; filename="${basename(objectKey)}"`,
    });
  }

  /**
   * Загружает файлы в хранилище.
   * Метод используется для загрузки файлов через бэкенд. Требуется SUPER_AWESOME_PASS_KEY.
   * Для общих случаев загрузки использовать методы сервисов соответствующих модулей.
   * @param submodule - условная подпапка, из доступных для загрузки через метод сервиса.
   * @param files - массив файлов.
   * @param passKey - ключ доступа SUPER_AWESOME_PASS_KEY.
   * @returns массив objectKey загруженных файлов.
   * **/
  public async uploadFiles(
    submodule: EStorageSubmodule,
    files: Array<Express.Multer.File>,
    passKey: string,
  ): Promise<string[]> {
    if (!passKey || passKey !== this.passKey)
      throw new BadRequestException(
        'Недостаточно прав для загрузки файлов в объектное хранилище: передан неверный ключ доступа',
      );
    return await Promise.all(files.map(file => this.uploadFile(submodule, file)));
  }

  /**
   * Загружает файл в хранилище.
   * Метод используется для загрузки файла через бэкенд. Требуется SUPER_AWESOME_PASS_KEY.
   * Для общих случаев загрузки использовать методы сервисов соответствующих модулей.
   * @param submodule - условная подпапка, из доступных для загрузки через метод сервиса.
   * @param file - бинарный файл.
   * @returns objectKey загруженного файла.
   * **/
  private async uploadFile(
    submodule: EStorageSubmodule,
    file: Express.Multer.File,
  ): Promise<string> {
    const key = this.buildObjectKey(submodule, file);
    await this.client.putObject(this.bucket, key, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    return key;
  }
}
