import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import type { TPatchBoard } from '@/modules/board/libs/types/board.types';
import {
  ValidateIfDefined,
  ValidateIfDefinedAndNotNull,
} from '@/modules/libs/decorators/validation.decorators';

export class PatchBoardDto implements TPatchBoard {
  @ValidateIfDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title?: string;

  @ValidateIfDefinedAndNotNull()
  @IsString()
  @MaxLength(128)
  description?: string | null;
}
