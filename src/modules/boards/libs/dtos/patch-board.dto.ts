import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ValidateIfDefined } from '@/libs/decorators/validation.decorators';
import type { TPatchBoard } from '@/modules/boards/libs/types/boards.types';

export class PatchBoardDto implements TPatchBoard {
  @ValidateIfDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title?: string;

  @ValidateIfDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  description?: string | null;
}
