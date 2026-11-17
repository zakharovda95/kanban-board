import { Entity, OneToMany } from 'typeorm';

import BaseEntity from '@/libs/entities/base.entity';
import BoardEntity from '@/modules/board/libs/entities/board.entity';
import UserEntity from '@/modules/user/libs/entities/user.entity';
import WorkspaceInviteEntity from '@/modules/workspace/libs/entities/workspace-invite.entity';

@Entity({ name: 'workspaces' })
export default class WorkspaceEntity extends BaseEntity {
  @OneToMany(() => UserEntity, entity => entity.workspace)
  users!: UserEntity[];

  @OneToMany(() => BoardEntity, entity => entity.workspace)
  boards!: BoardEntity[];

  @OneToMany(() => WorkspaceInviteEntity, entity => entity.workspace)
  invites!: WorkspaceInviteEntity[];
}
