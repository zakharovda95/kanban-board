import { EProfilePermissionField } from '@kanban-board/common';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import UserEntity from '@/modules/user/libs/entities/user.entity';

@Entity('profilePermissions')
@Index(['userId', 'field'], { unique: true })
export default class ProfilePermissionEntity extends BaseEntity {
  @Column({ type: 'enum', enum: EProfilePermissionField })
  field!: EProfilePermissionField;

  @Column({ type: 'int' })
  userId!: number;

  @ManyToOne(() => UserEntity, entity => entity.profilePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
