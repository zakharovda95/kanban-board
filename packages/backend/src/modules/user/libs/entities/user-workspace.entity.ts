import { EUserWorkspaceRole, EUserWorkspaceStatus } from '@kanban-board/common';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import UserEntity from '@/modules/user/libs/entities/user.entity';
import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';

@Entity({ name: 'userWorkspaces' })
export default class UserWorkspaceEntity extends BaseEntity {
  @Column({ type: 'enum', enum: EUserWorkspaceStatus, default: EUserWorkspaceStatus.ACTIVE })
  status!: EUserWorkspaceStatus;

  @Column({ type: 'enum', enum: EUserWorkspaceRole, default: EUserWorkspaceRole.USER })
  workspaceRole!: EUserWorkspaceRole;

  @Index()
  @Column({ type: 'int' })
  workspaceId!: number;

  @ManyToOne(() => WorkspaceEntity, entity => entity.userWorkspaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace!: WorkspaceEntity;

  @OneToOne(() => UserEntity, entity => entity.userWorkspace)
  user!: UserEntity;
}
