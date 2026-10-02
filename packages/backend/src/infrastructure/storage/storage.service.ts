import { randomUUID } from 'node:crypto';
import { basename } from 'node:path';

import { EStorageSubmodule, type TSuccessResponse } from '@kanban-board/common';
import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

import { getSuccessResponseWithData } from '@/libs/utilities/response.utilities';

/**
 * https://docs.min.io/aistor/developers/sdk/javascript/api/
 * https://habr.com/ru/articles/514948/
 * Объектное (S3) хранилище MinIO.
 * **/
@Injectable()
export default class StorageService {
  private readonly client: Minio.Client;
  private readonly bucket: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.getOrThrow<string>('MINIO_BUCKET');
    this.client = new Minio.Client({
      endPoint: this.configService.getOrThrow<string>('MINIO_HOST'),
      port: this.configService.getOrThrow<number>('MINIO_PORT'),
      accessKey: this.configService.getOrThrow<string>('MINIO_USER'),
      secretKey: this.configService.getOrThrow<string>('MINIO_PASSWORD'),
      useSSL: false,
    });
  }

  /** Чтение файла из хранилища. **/
  public async getFile(submodule: EStorageSubmodule, key: string): Promise<StreamableFile> {
    const objectKey = this.buildObjectKey(submodule, key);

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

  /** Загружает файлы в хранилище. **/
  public async uploadFiles(
    submodule: EStorageSubmodule,
    files: Array<Express.Multer.File>,
  ): Promise<TSuccessResponse<string[]>> {
    const keys = await Promise.all(files.map(file => this.uploadFile(submodule, file)));
    return getSuccessResponseWithData(keys);
  }

  /** Загружает файл в хранилище. **/
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

  /**
   * Формирует ключ файла (путь).
   * Если передан файл - формируется путь для загрузки файла в хранилище.
   * Если передано название файла - формируется путь для чтения файла.
   * **/
  private buildObjectKey(submodule: EStorageSubmodule, file: Express.Multer.File): string;
  private buildObjectKey(submodule: EStorageSubmodule, fileName: string): string;
  private buildObjectKey(
    submodule: EStorageSubmodule,
    fileOrName: Express.Multer.File | string,
  ): string {
    if (typeof fileOrName === 'string') {
      return `${submodule}/${fileOrName}`;
    }

    const safeName = fileOrName.originalname.replace(/[^\w.-]+/g, '_');
    return `${submodule}/${Date.now()}-${randomUUID()}-${safeName}`;
  }
}
