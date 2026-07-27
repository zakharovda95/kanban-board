import { ISSUE_TITLE_MAXLENGTH } from '@kanban-board/common';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { ColumnEntity } from '@/modules/column/libs/entities/column.entity';
import { MovableEntity } from '@/modules/shared/move/libs/entities/movable.entity';

@Entity('issues')
export class IssueEntity extends MovableEntity {
  @Column({ type: 'varchar', length: ISSUE_TITLE_MAXLENGTH })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Index()
  @Column({ type: 'uuid' })
  boardId: string;

  @Index()
  @Column({ type: 'uuid' })
  columnId: string;

  @ManyToOne(() => ColumnEntity, entity => entity.issues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'columnId' })
  column: ColumnEntity;
}
