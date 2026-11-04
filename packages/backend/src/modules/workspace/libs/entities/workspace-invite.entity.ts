import { DatetimeUtility, WORKSPACE_INVITE_LINK_EXPIRE_HOURS } from '@kanban-board/common';
import { BeforeInsert, Check, Column, Entity, Index } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';

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

  @Index()
  @Column({ type: 'int' })
  workspaceId!: number;
}
