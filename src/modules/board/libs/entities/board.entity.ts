import { Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CreatedUpdatedDeletedAtEntity } from '@/libs/entities/created-updated-deleted-at.entity';
import { ColumnEntity } from '@/modules/column/libs/entities/column.entity';

@Entity('boards')
@Check(`"order" >= 0`)
export class BoardEntity {
  @PrimaryGeneratedColumn()
  boardId: number;

  @Column(() => CreatedUpdatedDeletedAtEntity, { prefix: false })
  createdUpdatedDeletedAt: CreatedUpdatedDeletedAtEntity;

  @Column({ type: 'varchar', length: 128 })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column()
  order: number;

  @OneToMany(() => ColumnEntity, entity => entity.board, { cascade: ['insert'] })
  columns: ColumnEntity[];
}
