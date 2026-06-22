import { Check, Column } from 'typeorm';

import { BaseEntity } from '@/libs/entities/base.entity';
import { IMovable } from '@/modules/shared/move/libs/types/move.types';

@Check(`"order" > 0`)
export class MovableEntity extends BaseEntity implements IMovable {
  @Column({ type: 'int' })
  order: number;
}
