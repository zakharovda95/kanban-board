import { Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { DEFAULT_TITLE, DEFAULT_TITLE_LENGTH } from '@/libs/constants/shared.constants';
import { CreatedUpdatedDeletedAtEntity } from '@/libs/entities/created-updated-deleted-at.entity';
import { ColumnEntity } from '@/modules/columns/libs/entities/column.entity';

@Entity('boards')
@Check(`"order" >= 0`)
export class BoardEntity {
  @PrimaryGeneratedColumn()
  boardId: number;

  @Column(() => CreatedUpdatedDeletedAtEntity, { prefix: false })
  createdUpdatedDeletedAt: CreatedUpdatedDeletedAtEntity;

  @Column({ type: 'varchar', length: DEFAULT_TITLE_LENGTH, default: DEFAULT_TITLE })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'int', unique: true })
  order: number;

  @OneToMany(() => ColumnEntity, entity => entity.board, { cascade: ['insert'] })
  columns: ColumnEntity[];
}
