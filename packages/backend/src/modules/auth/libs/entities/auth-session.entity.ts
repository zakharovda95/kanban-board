import { MfaState } from '@nestjs/authentication';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { Json } from '@/modules/auth/libs/types/auth.types';

@Entity('sessions')
export class AuthSessionEntity {
  @PrimaryColumn({ type: 'text' })
  id!: string;

  @Index()
  @Column({ type: 'text' })
  userId!: string;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @Index()
  @Column({ type: 'timestamptz', name: 'expires_at' })
  expiresAt!: Date;

  @Column({ type: 'timestamptz', name: 'last_active_at' })
  lastActiveAt!: Date;

  @Column({ type: 'text', nullable: true })
  mfa!: MfaState | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, Json> | null;
}
