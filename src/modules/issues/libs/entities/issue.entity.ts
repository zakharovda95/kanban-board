import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { DEFAULT_TITLE_LENGTH } from '@/libs/constants/shared.constants';
import { CreatedUpdatedDeletedAtEntity } from '@/libs/entities/created-updated-deleted-at.entity';
import { ColumnEntity } from '@/modules/columns/libs/entities/column.entity';

@Entity('issues')
export class IssueEntity {
  @PrimaryGeneratedColumn()
  issueId: number;

  @Column(() => CreatedUpdatedDeletedAtEntity, { prefix: false })
  createdUpdatedDeletedAt: CreatedUpdatedDeletedAtEntity;

  @Column({ type: 'varchar', length: DEFAULT_TITLE_LENGTH })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column()
  order: number;

  @Index()
  @Column()
  columnId: number;

  @ManyToOne(() => ColumnEntity, entity => entity.issues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'columnId' })
  column: ColumnEntity;
}
