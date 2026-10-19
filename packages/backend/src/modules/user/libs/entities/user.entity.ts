import {
  AUTH_LOGIN_MAXLENGTH,
  EUserRole,
  EWorkspaceRole,
  USER_FIRST_NAME_MAXLENGTH,
  USER_LAST_NAME_MAXLENGTH,
} from '@kanban-board/common';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';

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

  @Column({ type: 'enum', enum: EWorkspaceRole, default: EWorkspaceRole.USER })
  workspaceRole: EWorkspaceRole;

  @Index()
  @Column({ type: 'int' })
  workspaceId: number;

  @ManyToOne(() => WorkspaceEntity, entity => entity.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: WorkspaceEntity;
}
