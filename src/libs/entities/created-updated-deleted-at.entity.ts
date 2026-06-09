import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class CreatedUpdatedDeletedAtEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
