import { EStorageSubmodule, type TSuccessResponse } from '@kanban-board/common';
import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import StorageService from '@/infrastructure/storage/storage.service';
import ParameterEnumPipe from '@/libs/pipes/parameter-enum.pipe';
import UploadedFilePipe from '@/libs/pipes/uploaded-file.pipe';

@Controller('storage')
export default class StorageController {
  constructor(private storageService: StorageService) {}

  @Get(':key')
  public async getFile(@Param('key') key: string): Promise<string> {
    return await this.storageService.getFile(key);
  }

  @Post(':submodule')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @Param('submodule', new ParameterEnumPipe(EStorageSubmodule)) submodule: EStorageSubmodule,
    @UploadedFile(UploadedFilePipe) body: Express.Multer.File,
  ): Promise<TSuccessResponse> {
    return await this.storageService.uploadFile(submodule, body);
  }
}
