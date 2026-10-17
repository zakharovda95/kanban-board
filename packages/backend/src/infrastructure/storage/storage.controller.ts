import {
  EStorageSubmodule,
  STORAGE_FILES_MAX_COUNT,
  type TSuccessResponse,
} from '@kanban-board/common';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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

@Controller('storage')
export default class StorageController {
  constructor(private storageService: StorageService) {}

  @Get(':submodule/:key')
  @UseFilters(S3ExceptionFilter)
  public async getFile(
    @Param('submodule', new ParameterEnumPipe(EStorageSubmodule)) submodule: EStorageSubmodule,
    @Param('key') key: string,
  ): Promise<StreamableFile> {
    return await this.storageService.getFile(submodule, key);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':submodule')
  @UseFilters(MulterExceptionFilter, S3ExceptionFilter)
  @UseInterceptors(FilesInterceptor('files', STORAGE_FILES_MAX_COUNT))
  public async uploadFile(
    @Param('submodule', new ParameterEnumPipe(EStorageSubmodule)) submodule: EStorageSubmodule,
    @UploadedFiles(uploadedFilePipe) files: Array<Express.Multer.File>,
  ): Promise<TSuccessResponse<string[]>> {
    return await this.storageService.uploadFiles(submodule, files);
  }
}
