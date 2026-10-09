import { PrimaryGeneratedColumn } from 'typeorm';

import DatesEntity from '@/libs/entities/dates.entity';

export default abstract class BaseEntity extends DatesEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
