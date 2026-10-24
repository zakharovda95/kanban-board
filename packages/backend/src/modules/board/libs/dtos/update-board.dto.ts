import { type TUpdateBoard } from '@kanban-board/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsDefined, IsInt, IsNumber, IsPositive } from 'class-validator';

import { VALIDATION_MESSAGES } from '@/libs/constants/validation.constants';
import CreateBoardDto from '@/modules/board/libs/dtos/create-board.dto';

export default class UpdateBoardDto extends PartialType(CreateBoardDto) implements TUpdateBoard {
  @IsDefined({ message: VALIDATION_MESSAGES.idRequired })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: VALIDATION_MESSAGES.idMustBeInteger },
  )
  @IsInt({ message: VALIDATION_MESSAGES.idMustBeInteger })
  @IsPositive({ message: VALIDATION_MESSAGES.idMustBePositive })
  id!: number;
}
