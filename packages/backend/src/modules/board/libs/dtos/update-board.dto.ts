import { type TUpdateBoard } from '@kanban-board/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

import { CreateBoardDto } from '@/modules/board/libs/dtos/create-board.dto';

export class UpdateBoardDto extends PartialType(CreateBoardDto) implements TUpdateBoard {
  @IsNumber()
  @IsInt()
  @IsPositive()
  id: number;
}
