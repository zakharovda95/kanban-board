import {
  DatetimeUtility,
  WORKSPACE_INVITE_LINK_EXPIRE_HOURS,
  WORKSPACE_INVITE_NAME_MAXLENGTH,
} from '@kanban-board/common';
import { BeforeInsert, Check, Column, Entity, Index, ManyToOne } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import WorkspaceEntity from '@/modules/workspace/libs/entities/workspace.entity';

@Entity('workspaceInvites')
@Check('"expiresAt" >= "createdAt"')
// добавил 2 секунды из-за ошибки при создании, появляется разница в несколько миллисекунд при выполнении setExpiresAt, и падает по ограничению.
@Check('"expiresAt" <= "createdAt" + INTERVAL \'4 hours 2 second\'')
export default class WorkspaceInviteEntity extends BaseEntity {
  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @BeforeInsert()
  setExpiresAt(): void {
    this.expiresAt = DatetimeUtility.add(new Date(), WORKSPACE_INVITE_LINK_EXPIRE_HOURS, 'hours');
  }

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  inviteTokenHash!: string;

  @Column({ type: 'varchar', length: WORKSPACE_INVITE_NAME_MAXLENGTH })
  name!: string;

  @Index()
  @Column({ type: 'int' })
  workspaceId!: number;

  @ManyToOne(() => WorkspaceEntity, entity => entity.invites, { onDelete: 'CASCADE' })
  workspace!: WorkspaceEntity;
}
