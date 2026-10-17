import { sleep, type TSuccessResponse } from '@kanban-board/common';
import { Injectable } from '@nestjs/common';

import { getSuccessResponse } from '@/libs/utilities/response.utilities';

@Injectable()
export default class StorageService {
  public async uploadFile(submodule: string, file: Express.Multer.File): Promise<TSuccessResponse> {
    await sleep(1000);
    console.log(file, submodule);
    return getSuccessResponse();
  }

  public async getFile(key: string): Promise<string> {
    await sleep(1000);
    return 'file ' + key;
  }
}
