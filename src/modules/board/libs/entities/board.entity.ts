import { Column, Entity, OneToMany } from 'typeorm';

import { ColumnEntity } from '@/modules/column/libs/entities/column.entity';
import { MovableEntity } from '@/modules/shared/move/libs/entities/movable.entity';

@Entity('boards')
export class BoardEntity extends MovableEntity {
  @Column({ type: 'varchar', length: 128 })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @OneToMany(() => ColumnEntity, entity => entity.board, { cascade: ['insert'] })
  columns: ColumnEntity[];
}
