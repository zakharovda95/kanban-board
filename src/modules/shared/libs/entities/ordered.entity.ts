import { Check, Column } from 'typeorm';

import { BaseEntity } from '@/modules/shared/libs/entities/base.entity';

@Check(`"order" > 0`)
export class OrderedEntity extends BaseEntity {
  @Column({ type: 'int' })
  order: number;
}
