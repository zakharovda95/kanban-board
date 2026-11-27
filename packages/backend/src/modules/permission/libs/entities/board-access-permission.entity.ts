import { EBoardAccessPermissionField } from '@kanban-board/common';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import BoardEntity from '@/modules/board/libs/entities/board.entity';
import UserEntity from '@/modules/user/libs/entities/user.entity';

@Entity('boardAccessPermissions')
// составной индекс для быстрого поиска по userId, boardId и field
@Index(['userId', 'boardId', 'field'], { unique: true })
export default class BoardAccessPermissionEntity extends BaseEntity {
  @Column({ type: 'enum', enum: EBoardAccessPermissionField })
  field!: EBoardAccessPermissionField;

  @Index()
  @Column({ type: 'int' })
  boardId!: number;

  @ManyToOne(() => BoardEntity, entity => entity.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  board!: BoardEntity;

  @Column({ type: 'int' })
  userId!: number;

  @ManyToOne(() => UserEntity, entity => entity.boardAccessPermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
