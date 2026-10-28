import { AuthenticationStorage, SessionRecord, SessionStore } from '@nestjs/authentication';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, LessThan, LessThanOrEqual } from 'typeorm';

import { AuthSessionEntity } from '@/modules/auth/libs/entities/auth-session.entity';
import type { Json, WithoutNulls } from '@/modules/auth/libs/types/auth.types';

@Injectable()
export default class AuthSessionStore implements SessionStore {
  constructor(
    private dataSource: DataSource,
    authStorage: AuthenticationStorage,
  ) {
    authStorage.registerSource({
      sessions: this,
    });
  }

  private withoutNulls<T extends object>(row: T): WithoutNulls<T> {
    return Object.fromEntries(
      Object.entries(row).filter(([_, value]) => value !== null),
    ) as WithoutNulls<T>;
  }

  private get manager() {
    const { manager } = this.dataSource;
    return manager;
  }

  public async getSession(id: string): Promise<SessionRecord | undefined> {
    if (!id) throw new InternalServerErrorException('Не найден идентификатор сессии');

    const session = await this.manager.findOne(AuthSessionEntity, { where: { id } });
    return session ? this.withoutNulls(session) : undefined;
  }

  public async createSession(record: SessionRecord): Promise<void> {
    if (!record) throw new InternalServerErrorException('Не найдены данные сессии');

    const metadata = (record.metadata ?? null) as Record<string, Json> | null;
    const newSession = this.manager.create(AuthSessionEntity, {
      ...record,
      mfa: record.mfa ?? null,
      metadata,
    });
    const createdSession = await this.manager.save(newSession);
    if (!createdSession)
      throw new InternalServerErrorException('Произошла ошибка при создании сессии');

    await this.manager.delete(AuthSessionEntity, { expiresAt: LessThanOrEqual(record.createdAt) });
  }

  public async touchSession(id: string, lastActiveAt: Date): Promise<void> {
    if (!id || !lastActiveAt)
      throw new InternalServerErrorException('Не найдены данные для обновления сессии');

    await this.manager.update(
      AuthSessionEntity,
      { id, lastActiveAt: LessThan(lastActiveAt) },
      { lastActiveAt },
    );
  }

  public async deleteSession(id: string): Promise<boolean> {
    if (!id) throw new InternalServerErrorException('Не найден идентификатор сессии');

    const { affected } = await this.manager.delete(AuthSessionEntity, { id });
    return (affected ?? 0) > 0;
  }

  public async listUserSessions(userId: string): Promise<SessionRecord[]> {
    if (!userId) throw new InternalServerErrorException('Не найден идентификатор пользователя');

    const sessions = await this.manager.findBy(AuthSessionEntity, { userId });
    return sessions.map(session => this.withoutNulls(session));
  }

  public async deleteUserSessions(userId: string): Promise<void> {
    if (!userId) throw new InternalServerErrorException('Не найден идентификатор пользователя');
    await this.manager.delete(AuthSessionEntity, { userId });
  }
}
