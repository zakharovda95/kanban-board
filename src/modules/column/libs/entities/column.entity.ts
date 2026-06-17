import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BoardEntity } from '@/modules/board/libs/entities/board.entity';
import { IssueEntity } from '@/modules/issue/libs/entities/issue.entity';
import { MovableEntity } from '@/modules/shared/move/libs/entities/movable.entity';

@Entity('columns')
export class ColumnEntity extends MovableEntity {
  @Column({ type: 'varchar', length: 128 })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column('varchar')
  color: string;

  @Index()
  @Column()
  boardId: number;

  @ManyToOne(() => BoardEntity, entity => entity.columns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  board: BoardEntity;

  @OneToMany(() => IssueEntity, entity => entity.column)
  issues: IssueEntity[];
}
