import { FILE_MIME_TYPES, FileUtility, STORAGE_FILE_MAX_SIZE } from '@kanban-board/common';
import { FileTypeValidator, HttpStatus, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

/** Валидирует загружаемые файлы. **/
export const uploadedFilePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: STORAGE_FILE_MAX_SIZE,
      errorMessage: ({ config }) => `Размер файла не должен превышать ${config.maxSize / 1024}Кб.`,
    }),
    new FileTypeValidator({
      fileType: FileUtility.buildMimeTypeRegExp(FILE_MIME_TYPES),
      errorMessage: () =>
        `Недопустимый формат файла. Допустимые форматы: ${FILE_MIME_TYPES.join(', ')}`,
    }),
  ],
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});
