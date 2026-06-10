import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DEFAULT_TITLE, DEFAULT_TITLE_LENGTH } from '@/libs/constants/shared.constants';
import { CreatedUpdatedDeletedAtEntity } from '@/libs/entities/created-updated-deleted-at.entity';
import { BoardEntity } from '@/modules/boards/libs/entities/board.entity';
import { IssueEntity } from '@/modules/issues/libs/entities/issue.entity';

@Entity('columns')
export class ColumnEntity {
  @PrimaryGeneratedColumn()
  columnId: number;

  @Column(() => CreatedUpdatedDeletedAtEntity, { prefix: false })
  createdUpdatedDeletedAt: CreatedUpdatedDeletedAtEntity;

  @Column({ type: 'varchar', length: DEFAULT_TITLE_LENGTH, default: DEFAULT_TITLE })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column('varchar')
  color: string;

  @Column({ type: 'int', unique: true })
  order: number;

  @Index()
  @Column()
  boardId: number;

  @ManyToOne(() => BoardEntity, entity => entity.columns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  board: BoardEntity;

  @OneToMany(() => IssueEntity, entity => entity.column)
  issues: IssueEntity[];
}
