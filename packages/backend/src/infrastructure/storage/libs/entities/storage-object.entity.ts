import {
  EStorageUploadStatus,
  STORAGE_FILE_NAME_MAXLENGTH,
  STORAGE_OBJECT_KEY_MAXLENGTH,
  type TFileMimeType,
} from '@kanban-board/common';
import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

import DatesEntity from '@/libs/entities/dates.entity';

export default abstract class StorageObjectEntity extends DatesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  clientId: string;

  @Column({ type: 'varchar', length: STORAGE_OBJECT_KEY_MAXLENGTH })
  objectKey: string;

  @Column({ type: 'varchar', length: STORAGE_FILE_NAME_MAXLENGTH })
  fileName: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'varchar' })
  mimeType: TFileMimeType;

  @Index()
  @Column({
    type: 'enum',
    enum: EStorageUploadStatus,
    enumName: 'EStorageUploadStatus',
    default: EStorageUploadStatus.ERROR,
  })
  status: EStorageUploadStatus;
}
