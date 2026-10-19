import { Check, Column, Entity, OneToMany } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import UserEntity from '@/modules/user/libs/entities/user.entity';

@Entity({ name: 'workspaces' })
@Check('"expiresAt" >= "createdAt"')
@Check('"expiresAt" <= "createdAt" + INTERVAL \'7 days\'')
export default class WorkspaceEntity extends BaseEntity {
  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @OneToMany(() => UserEntity, entity => entity.workspace)
  users: UserEntity[];
}
