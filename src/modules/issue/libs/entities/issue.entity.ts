import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { ColumnEntity } from '@/modules/column/libs/entities/column.entity';
import { OrderedEntity } from '@/modules/shared/libs/entities/ordered.entity';

@Entity('issues')
export class IssueEntity extends OrderedEntity {
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
