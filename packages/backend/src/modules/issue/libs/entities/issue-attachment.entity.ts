import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import StorageObjectEntity from '@/infrastructure/storage/libs/entities/storage-object.entity';
import IssueEntity from '@/modules/issue/libs/entities/issue.entity';

@Entity('issue-attachment')
export default class IssueAttachmentEntity extends StorageObjectEntity {
  /** Может быть null тк на момент создания записи еще не создана задача. **/
  @Column({ type: 'int', nullable: true })
  issueId: number | null;

  @ManyToOne(() => IssueEntity, entity => entity.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'issueId' })
  issue: IssueEntity;
}
