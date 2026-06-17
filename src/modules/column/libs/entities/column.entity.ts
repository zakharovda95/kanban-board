import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CreatedUpdatedDeletedAtEntity } from '@/libs/entities/created-updated-deleted-at.entity';
import { BoardEntity } from '@/modules/board/libs/entities/board.entity';
import { IssueEntity } from '@/modules/issue/libs/entities/issue.entity';

@Entity('columns')
export class ColumnEntity {
  @PrimaryGeneratedColumn()
  columnId: number;

  @Column(() => CreatedUpdatedDeletedAtEntity, { prefix: false })
  createdUpdatedDeletedAt: CreatedUpdatedDeletedAtEntity;

  @Column({ type: 'varchar', length: 128 })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column('varchar')
  color: string;

  @Column()
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
