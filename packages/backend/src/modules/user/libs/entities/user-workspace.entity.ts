import { EWorkspaceRole } from '@kanban-board/common';
import { Check, Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import UserEntity from '@/modules/user/libs/entities/user.entity';
import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';

@Entity({ name: 'userWorkspaces' })
@Check('"expiresAt" >= "createdAt"')
// добавил 2 секунды из-за ошибки при создании, появляется разница в несколько миллисекунд при выполнении setExpiresAt, и падает по ограничению.
@Check('"expiresAt" <= "createdAt" + INTERVAL \'7 days 2 second\'')
export default class UserWorkspaceEntity extends BaseEntity {
  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ type: 'enum', enum: EWorkspaceRole, default: EWorkspaceRole.USER })
  workspaceRole!: EWorkspaceRole;

  @Index()
  @Column({ type: 'int' })
  workspaceId!: number;

  @ManyToOne(() => WorkspaceEntity, entity => entity.userWorkspaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace!: WorkspaceEntity;

  @Index({ unique: true })
  @Column({ type: 'int' })
  userId!: number;

  @OneToOne(() => UserEntity, entity => entity.userWorkspace, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
