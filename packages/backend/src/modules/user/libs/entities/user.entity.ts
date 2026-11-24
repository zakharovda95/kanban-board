import {
  AUTH_LOGIN_MAXLENGTH,
  EUserRole,
  EUserWorkspaceRole,
  EUserWorkspaceStatus,
  USER_FIRST_NAME_MAXLENGTH,
  USER_LAST_NAME_MAXLENGTH,
} from '@kanban-board/common';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import BoardAccessPermissionEntity from '@/modules/permission/libs/entities/board-access-permission.entity';
import BoardPermissionEntity from '@/modules/permission/libs/entities/board-permission.entity';
import ProfilePermissionEntity from '@/modules/permission/libs/entities/profile-permission.entity';
import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';

@Entity({ name: 'users' })
export default class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: USER_FIRST_NAME_MAXLENGTH })
  firstName!: string;

  @Column({ type: 'varchar', length: USER_LAST_NAME_MAXLENGTH })
  lastName!: string;

  @Column({ type: 'varchar', unique: true, length: AUTH_LOGIN_MAXLENGTH })
  login!: string;

  @Column({ type: 'text' })
  passwordHash!: string;

  @Column({ type: 'enum', enum: EUserRole, default: EUserRole.USER })
  systemRole!: EUserRole;

  @Column({ type: 'text', nullable: true })
  avatar!: string | null;

  @Column({ type: 'enum', enum: EUserWorkspaceStatus, default: EUserWorkspaceStatus.ACTIVE })
  status!: EUserWorkspaceStatus;

  @Column({ type: 'enum', enum: EUserWorkspaceRole, default: EUserWorkspaceRole.USER })
  workspaceRole!: EUserWorkspaceRole;

  @Index()
  @Column({ type: 'int' })
  workspaceId!: number;

  @ManyToOne(() => WorkspaceEntity, entity => entity.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace!: WorkspaceEntity;

  @OneToMany(() => ProfilePermissionEntity, entity => entity.user)
  profilePermissions!: ProfilePermissionEntity[];

  @OneToMany(() => BoardPermissionEntity, entity => entity.user)
  boardPermissions!: BoardPermissionEntity[];

  @OneToMany(() => BoardAccessPermissionEntity, entity => entity.user)
  boardAccessPermissions!: BoardAccessPermissionEntity[];
}
