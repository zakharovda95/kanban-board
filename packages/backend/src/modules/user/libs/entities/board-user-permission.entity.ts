import { EBoardUserPermissionType } from '@kanban-board/common';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import UserEntity from '@/modules/user/libs/entities/user.entity';

@Entity('boardUserPermissions')
@Index(['userId', 'type'], { unique: true })
export default class BoardUserPermissionEntity extends BaseEntity {
  @Column({ type: 'enum', enum: EBoardUserPermissionType })
  type!: EBoardUserPermissionType;

  @Column({ type: 'int' })
  userId!: number;

  @ManyToOne(() => UserEntity, entity => entity.boardPermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
