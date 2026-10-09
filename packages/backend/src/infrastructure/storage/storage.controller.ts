import {
  EStorageSubmodule,
  STORAGE_MAX_FILES_COUNT,
  type TSuccessResponse,
} from '@kanban-board/common';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  StreamableFile,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import StorageService from '@/infrastructure/storage/storage.service';
import MulterExceptionFilter from '@/libs/filters/multer-exception.filter';
import S3ExceptionFilter from '@/libs/filters/s3-exception.filter';
import ParameterEnumPipe from '@/libs/pipes/parameter-enum.pipe';
import { uploadedFilePipe } from '@/libs/pipes/uploaded-file.pipe';
import { getSuccessResponseWithData } from '@/libs/utilities/response.utilities';

@Controller('storage')
export default class StorageController {
  constructor(private storageService: StorageService) {}

  /** Метод для прямого получения файла из хранилища по его ключу. Требуется SUPER_AWESOME_PASS_KEY. **/
  @Get(':key')
  @UseFilters(S3ExceptionFilter)
  public async getFile(
    @Param('key') key: string,
    @Query('passKey') passKey: string,
  ): Promise<StreamableFile> {
    return await this.storageService.getFile(key, passKey);
  }

  /** Метод для прямой загрузки файлов в хранилище. Требуется SUPER_AWESOME_PASS_KEY. **/
  @HttpCode(HttpStatus.OK)
  @Post(':submodule')
  @UseFilters(MulterExceptionFilter, S3ExceptionFilter)
  @UseInterceptors(FilesInterceptor('files', STORAGE_MAX_FILES_COUNT))
  public async uploadFile(
    @Param('submodule', new ParameterEnumPipe(EStorageSubmodule)) submodule: EStorageSubmodule,
    @UploadedFiles(uploadedFilePipe) files: Array<Express.Multer.File>,
    @Query('passKey') passKey: string,
  ): Promise<TSuccessResponse<string[]>> {
    const objectKeys = await this.storageService.uploadFiles(submodule, files, passKey);
    return getSuccessResponseWithData<string[]>(objectKeys);
  }
}
