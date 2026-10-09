import {
  FILE_MIME_TYPES,
  STORAGE_FILE_NAME_MAXLENGTH,
  STORAGE_MAX_FILE_SIZE,
  type TFileMimeType,
  type TStorageUploadMeta,
} from '@kanban-board/common';
import {
  IsDefined,
  IsIn,
  IsInt,
  IsMimeType,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
} from 'class-validator';

export default class StorageUploadMetaDto implements TStorageUploadMeta {
  @IsUUID(4, { message: 'Клиентский идентификатор файла должен быть в формате UUID v4' })
  clientId: string;

  @IsNotEmpty({ message: 'Имя файла обязательно для заполнения' })
  @IsString({ message: 'Имя файла должно быть строкой' })
  @MaxLength(STORAGE_FILE_NAME_MAXLENGTH, {
    message: `Имя файла не должно превышать ${STORAGE_FILE_NAME_MAXLENGTH} символов`,
  })
  fileName: string;

  @IsMimeType({ message: 'Указан некорректный MIME-тип файла' })
  @IsIn(FILE_MIME_TYPES, {
    message: `Недопустимый MIME-тип файла. Разрешённые значения: ${FILE_MIME_TYPES.join(', ')}`,
  })
  mimeType: TFileMimeType;

  @IsDefined({ message: 'Размер файла обязателен для заполнения' })
  @IsInt({ message: 'Размер файла должен быть целым числом' })
  @IsPositive({ message: 'Размер файла должен быть больше 0' })
  @Max(STORAGE_MAX_FILE_SIZE, {
    message: `Размер файла не должен превышать ${STORAGE_MAX_FILE_SIZE / 1024} Кб`,
  })
  size: number;
}
