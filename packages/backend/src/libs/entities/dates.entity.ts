import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export default abstract class DatesEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
