import { STORAGE_MAX_FILES_COUNT } from '@kanban-board/common';
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  ParseArrayPipe,
} from '@nestjs/common';

import StorageUploadMetaDto from '@/infrastructure/storage/libs/dtos/storage-upload-meta.dto';

export type TStorageUploadMetaPipeOptions = Partial<{
  /** Разрешить пустой массив **/
  allowEmpty: boolean;
}>;

@Injectable()
export default class StorageUploadMetaPipe extends ParseArrayPipe {
  private readonly defaultOptions: TStorageUploadMetaPipeOptions = {
    allowEmpty: false,
  };

  constructor(options?: TStorageUploadMetaPipeOptions) {
    super({
      items: StorageUploadMetaDto,
      exceptionFactory: () => {
        return new HttpException(
          'Не переданы или некорректны метаданные файлов, необходимые для инициализации загрузки',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    });

    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  public override async transform(array: StorageUploadMetaDto[], metadata: ArgumentMetadata) {
    await super.transform(array, metadata);

    const { allowEmpty } = this.defaultOptions;

    if (!allowEmpty && !array.length)
      throw new HttpException(
        'Список метаданных файлов для загрузки не может быть пустым',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    if (array.length > STORAGE_MAX_FILES_COUNT) {
      throw new HttpException(
        `Максимально допустимое количество файлов для одновременной загрузки ${STORAGE_MAX_FILES_COUNT}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return array;
  }
}
