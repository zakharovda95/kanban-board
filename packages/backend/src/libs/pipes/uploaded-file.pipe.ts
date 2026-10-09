import { FILE_MIME_TYPES, FileUtility, STORAGE_MAX_FILE_SIZE } from '@kanban-board/common';
import { FileTypeValidator, HttpStatus, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

/** Валидирует загружаемые файлы. **/
export const uploadedFilePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: STORAGE_MAX_FILE_SIZE,
      errorMessage: ({ config }) =>
        `Размер загружаемого файла превышает допустимый лимит ${config.maxSize / 1024} Кб`,
    }),
    new FileTypeValidator({
      fileType: FileUtility.buildMimeTypeRegExp(FILE_MIME_TYPES),
      errorMessage: () =>
        `Недопустимый формат загружаемого файла. Разрешённые MIME-типы: ${FILE_MIME_TYPES.join(', ')}`,
    }),
  ],
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});
