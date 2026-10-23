import {
  AUTH_LOGIN_MAXLENGTH,
  EUserRole,
  EUserStatus,
  USER_FIRST_NAME_MAXLENGTH,
  USER_LAST_NAME_MAXLENGTH,
} from '@kanban-board/common';
import { Column, Entity, OneToOne } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import UserWorkspaceEntity from '@/modules/user/libs/entities/user-workspace.entity';

@Entity({ name: 'users' })
export default class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: USER_FIRST_NAME_MAXLENGTH })
  firstName: string;

  @Column({ type: 'varchar', length: USER_LAST_NAME_MAXLENGTH })
  lastName: string;

  @Column({ type: 'varchar', unique: true, length: AUTH_LOGIN_MAXLENGTH })
  login: string;

  @Column({ type: 'text' })
  passwordHash: string;

  @Column({ type: 'enum', enum: EUserRole, default: EUserRole.USER })
  systemRole: EUserRole;

  @Column({ type: 'enum', enum: EUserStatus, default: EUserStatus.ACTIVE })
  status: EUserStatus;

  @Column({ type: 'text' })
  avatar: string | null;

  @OneToOne(() => UserWorkspaceEntity, entity => entity.user)
  userWorkspace: UserWorkspaceEntity;
}
