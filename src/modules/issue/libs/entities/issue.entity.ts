import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { ColumnEntity } from '@/modules/column/libs/entities/column.entity';
import { MovableEntity } from '@/modules/shared/move/libs/entities/movable.entity';

@Entity('issues')
export class IssueEntity extends MovableEntity {
  @Column({ type: 'varchar', length: 128 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Index()
  @Column()
  columnId: number;

  @ManyToOne(() => ColumnEntity, entity => entity.issues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'columnId' })
  column: ColumnEntity;
}
