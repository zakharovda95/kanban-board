import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ValidateIfDefined } from '@/libs/decorators/validation.decorators';
import type { TPatchBoard } from '@/modules/boards/libs/boards.types';

export class PatchBoardDto implements TPatchBoard {
  @ValidateIfDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  title?: string;

  @ValidateIfDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  description?: string | null;
}
