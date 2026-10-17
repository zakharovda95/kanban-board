import { FILE_MIME_TYPES } from '@kanban-board/common';
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

const AVAILABLE_FILE_SIZE = 500 * 1024;

/** Валидирует загружаемые файлы. **/
@Injectable()
export default class UploadedFilePipe implements PipeTransform {
  transform(file: Express.Multer.File, _: ArgumentMetadata) {
    if (!file) {
      throw new HttpException(`Файл не передан.`, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (file.size > AVAILABLE_FILE_SIZE) {
      throw new HttpException(
        `Размер файла не должен превышать ${AVAILABLE_FILE_SIZE / 1024}Кб.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!FILE_MIME_TYPES.includes(file.mimetype)) {
      throw new HttpException(
        `Недопустимый формат файла. Допустимые форматы: ${FILE_MIME_TYPES.join(', ')}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return file;
  }
}
