import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';

import { isDefined } from '@/libs/utils/check.utils';
import { BOARDS_EXCEPTION_MESSAGES } from '@/modules/boards/libs/constants/boards-exception.constants';
import { MoveBoardDto } from '@/modules/boards/libs/dtos/move-board.dto';

export class MoveBoardPipe implements PipeTransform {
  transform(dto: MoveBoardDto, _: ArgumentMetadata): MoveBoardDto {
    const { previousBoardId, nextBoardId } = dto;

    if (isDefined(previousBoardId) && isDefined(nextBoardId)) {
      throw new HttpException(
        BOARDS_EXCEPTION_MESSAGES.onlyOneBoardIdShouldBeSpecified,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return dto;
  }
}
