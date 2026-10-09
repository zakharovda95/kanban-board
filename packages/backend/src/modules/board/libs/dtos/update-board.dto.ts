import { type TUpdateBoard } from '@kanban-board/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsDefined, IsInt, IsNumber, IsPositive } from 'class-validator';

import CreateBoardDto from '@/modules/board/libs/dtos/create-board.dto';

export default class UpdateBoardDto extends PartialType(CreateBoardDto) implements TUpdateBoard {
  @IsDefined({ message: 'Идентификатор доски обязателен' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Идентификатор доски должен быть числом' },
  )
  @IsInt({ message: 'Идентификатор доски должен быть целым числом' })
  @IsPositive({ message: 'Идентификатор доски должен быть больше 0' })
  id: number;
}
