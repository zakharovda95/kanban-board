import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import type { TSuccessResponse } from '@/libs/types/response.types';
import { ColorUtility } from '@/libs/utilities/color.utility';
import { OrderUtility } from '@/libs/utilities/order.utility';
import {
  getSuccessResponse,
  getSuccessResponseWithData,
} from '@/libs/utilities/response.utilities';
import { sleep } from '@/libs/utilities/sleep.utils';
import { ColumnEntity } from '@/modules/column/libs/entities/column.entity';
import type {
  TCreateColumn,
  TCreateColumnResponse,
  TPatchColumn,
} from '@/modules/column/libs/types/column.types';
import { TMoveParameters } from '@/modules/shared/move/libs/types/move.types';

@Injectable()
export class ColumnService {
  constructor(private dataSource: DataSource) {}

  public async createColumn(boardId: number, body: TCreateColumn): Promise<TCreateColumnResponse> {
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const columnsCount = await manager.count(ColumnEntity, { where: { boardId } });

    const { id } = await manager.save(ColumnEntity, {
      title: body.title,
      description: body?.description ?? null,
      color: body.color || ColorUtility.getRandomHexColor(),
      order: OrderUtility.calculateOrderByIndex(columnsCount),
      boardId: boardId,
    });
    if (!id) throw new InternalServerErrorException(EXCEPTION_MESSAGES.createFailed);

    return getSuccessResponseWithData({ id });
  }

  public async moveColumn(columnId: number, body: TMoveParameters): Promise<TSuccessResponse> {
    if (!columnId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    await sleep();

    return getSuccessResponse();
  }

  public async patchColumn(columnId: number, body: TPatchColumn): Promise<TSuccessResponse> {
    if (!columnId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);
    if (!body) throw new BadRequestException(EXCEPTION_MESSAGES.requestBodyNotFound);

    const { manager } = this.dataSource;

    const column = await manager.findOne(ColumnEntity, { where: { id: columnId } });
    if (!column) throw new NotFoundException(EXCEPTION_MESSAGES.notFound);

    await manager.save(Object.assign(column, body));

    return getSuccessResponse();
  }

  public async deleteColumn(columnId: number): Promise<TSuccessResponse> {
    if (!columnId) throw new BadRequestException(EXCEPTION_MESSAGES.idNotFound);

    const { manager } = this.dataSource;

    const { affected } = await manager.delete(ColumnEntity, { id: columnId });
    if (!affected || affected <= 0)
      throw new InternalServerErrorException(EXCEPTION_MESSAGES.deleteFailed);

    return getSuccessResponse();
  }
}
