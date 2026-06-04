import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CreatedUpdatedDeletedAtEntity } from '@/infrastructure/database/libs/entities/created-updated-deleted-at.entity';
import { DEFAULT_TITLE, DEFAULT_TITLE_LENGTH } from '@/libs/constants/shared.constants';
import { ColumnEntity } from '@/modules/columns/libs/entities/column.entity';

@Entity('issues')
export class IssueEntity {
  @PrimaryGeneratedColumn()
  issueId: number;

  @Column(() => CreatedUpdatedDeletedAtEntity, { prefix: false })
  createdUpdatedDeletedAt: CreatedUpdatedDeletedAtEntity;

  @Column({ type: 'varchar', length: DEFAULT_TITLE_LENGTH, default: DEFAULT_TITLE })
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
