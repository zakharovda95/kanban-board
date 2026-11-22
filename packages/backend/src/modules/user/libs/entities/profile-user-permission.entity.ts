import { EProfileUserPermissionType } from '@kanban-board/common';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import UserEntity from '@/modules/user/libs/entities/user.entity';

@Entity('profileUserPermissions')
@Index(['userId', 'type'], { unique: true })
export default class ProfileUserPermissionEntity extends BaseEntity {
  @Column({ type: 'enum', enum: EProfileUserPermissionType })
  type!: EProfileUserPermissionType;

  @Column({ type: 'int' })
  userId!: number;

  @ManyToOne(() => UserEntity, entity => entity.profilePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
