import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CreatedUpdatedDeletedAtEntity } from '@/infrastructure/database/libs/entities/created-updated-deleted-at.entity';
import { DEFAULT_TITLE, DEFAULT_TITLE_LENGTH } from '@/libs/constants/shared.constants';
import { ColumnEntity } from '@/modules/columns/libs/entities/column.entity';

@Entity('boards')
export class BoardEntity {
  @PrimaryGeneratedColumn()
  boardId: number;

  @Column(() => CreatedUpdatedDeletedAtEntity, { prefix: false })
  createdUpdatedDeletedAt: CreatedUpdatedDeletedAtEntity;

  @Column({ type: 'varchar', length: DEFAULT_TITLE_LENGTH, default: DEFAULT_TITLE })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @OneToMany(() => ColumnEntity, entity => entity.board)
  columns: ColumnEntity[];
}
