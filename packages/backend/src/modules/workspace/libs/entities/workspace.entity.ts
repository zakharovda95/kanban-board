import { DatetimeUtility, EXPIRES_DAYS } from '@kanban-board/common';
import { BeforeInsert, Check, Column, Entity, OneToMany } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import UserWorkspaceEntity from '@/modules/user/libs/entities/user-workspace.entity';

@Entity({ name: 'workspaces' })
@Check('"expiresAt" >= "createdAt"')
// добавил 2 секунды из-за ошибки при создании, появляется разница в несколько миллисекунд при выполнении setExpiresAt, и падает по ограничению.
@Check('"expiresAt" <= "createdAt" + INTERVAL \'7 days 2 second\'')
export default class WorkspaceEntity extends BaseEntity {
  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @BeforeInsert()
  setExpiresAt(): void {
    this.expiresAt = DatetimeUtility.add(new Date(), EXPIRES_DAYS, 'day');
  }

  @OneToMany(() => UserWorkspaceEntity, entity => entity.workspace)
  userWorkspaces: UserWorkspaceEntity[];
}
