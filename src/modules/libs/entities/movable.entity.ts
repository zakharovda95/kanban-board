import { Check, Column } from 'typeorm';

import { BaseEntity } from '@/modules/libs/entities/base.entity';

@Check(`"order" > 0`)
export class MovableEntity extends BaseEntity {
  @Column({ type: 'int' })
  order: number;
}
