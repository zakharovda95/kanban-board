import { IMovable } from '@kanban-board/common';
import { Check, Column } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';

@Check(`"order" > 0`)
export default class MovableEntity extends BaseEntity implements IMovable {
  @Column({ type: 'int' })
  order: number;
}
