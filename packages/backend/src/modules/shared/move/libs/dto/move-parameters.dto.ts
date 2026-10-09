import type { TMoveParameters } from '@kanban-board/common';
import { IsDefined, IsInt, IsNumber, IsPositive } from 'class-validator';

import { ValidateIfDefinedAndNotNull } from '@/libs/decorators/validation.decorators';

export default class MoveParametersDto implements TMoveParameters {
  @ValidateIfDefinedAndNotNull()
  @IsInt({ message: 'Идентификатор предыдущего элемента должен быть целым числом' })
  @IsPositive({ message: 'Идентификатор предыдущего элемента должен быть больше 0' })
  previousId?: number;

  @IsDefined({ message: 'Идентификатор перемещаемого элемента обязателен' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Идентификатор перемещаемого элемента должен быть числом' },
  )
  @IsInt({ message: 'Идентификатор перемещаемого элемента должен быть целым числом' })
  @IsPositive({ message: 'Идентификатор перемещаемого элемента должен быть больше 0' })
  targetId: number;
}
