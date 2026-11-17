import {
  EUserRole,
  EUserWorkspaceStatus,
  RandomUtility,
  type TAuthCredentials,
  type TCreateUser,
  type TPositiveIdSchema,
  type TUpdateUserBodySchema,
  type TUser,
  type TUserBase,
  USER_AVATARS,
} from '@kanban-board/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import { AuthSessionEntity } from '@/modules/auth/libs/entities/auth-session.entity';
import UserEntity from '@/modules/user/libs/entities/user.entity';
import UserMapper from '@/modules/user/libs/mappers/user.mapper';

@Injectable()
export default class UserService {
  constructor(
    private dataSource: DataSource,
    private userMapper: UserMapper,
  ) {}

  /**
   * Получить текущего пользователя по его Id (для провайдера сессии).
   * @param userId - Id пользователя.
   * @returns объект пользователя.
   * **/
  public async getMe(userId: TPositiveIdSchema): Promise<TUser | null> {
    const { manager } = this.dataSource;

    const user = await manager.findOne(UserEntity, {
      where: { id: userId },
    });
    if (!user) return null;

    return this.userMapper.toModel(user, { base: false });
  }

  /**
   * Получить пользователя по его Id или логину (перегрузка, общие случаи использования).
   * @param login - логин или Id пользователя.
   * @returns объект пользователя.
   * **/
  public async getUserBy(login: string): Promise<TUser>;
  public async getUserBy(userId: TPositiveIdSchema): Promise<TUser>;
  public async getUserBy(loginOrId: string | TPositiveIdSchema): Promise<TUser> {
    const isLogin = typeof loginOrId === 'string';

    const { manager } = this.dataSource;

    const user = await manager.findOne(UserEntity, {
      where: isLogin ? { login: loginOrId } : { id: loginOrId },
    });

    if (!user) {
      throw new NotFoundException(
        `Пользователь по указанному ${isLogin ? 'логину' : 'идентификатору'} не найден`,
      );
    }

    return this.userMapper.toModel(user, { base: false });
  }

  /**
   * Получить данные аутентификации пользователя по его Id или логину.
   * @param login - логин или Id пользователя.
   * @returns объект с данными аутентификации.
   * **/
  public async getUserCredentialsBy(login: string): Promise<TAuthCredentials>;
  public async getUserCredentialsBy(userId: TPositiveIdSchema): Promise<TAuthCredentials>;
  public async getUserCredentialsBy(
    loginOrId: string | TPositiveIdSchema,
  ): Promise<TAuthCredentials> {
    const isLogin = typeof loginOrId === 'string';

    const { manager } = this.dataSource;

    const user = await manager.findOne(UserEntity, {
      where: isLogin ? { login: loginOrId } : { id: loginOrId },
    });

    if (!user) {
      throw new NotFoundException(
        `Пользователь по указанному ${isLogin ? 'логину' : 'идентификатору'} не найден`,
      );
    }

    return {
      userId: user.id,
      login: user.login,
      passwordHash: user.passwordHash,
    };
  }

  /**
   * Создать нового пользователя.
   * @param transactionalManager - транзакционный менеджер, переданный клиентским кодом.
   * @param body - имя и фамилия пользователя.
   * @returns объект созданного пользователя.
   * **/
  public async createUser(transactionalManager: EntityManager, body: TCreateUser): Promise<TUser> {
    const { firstName, lastName, workspaceId, login, passwordHash, workspaceRole } = body;

    const newUser = transactionalManager.create(UserEntity, {
      firstName,
      lastName,
      login,
      passwordHash,
      systemRole: EUserRole.USER,
      avatar: RandomUtility.getRandomFromArray(USER_AVATARS),
      workspaceId,
      workspaceRole,
      status: EUserWorkspaceStatus.ACTIVE,
    });

    const createdUser = await transactionalManager.save(newUser);

    return this.userMapper.toModel(createdUser, { base: false });
  }

  /**
   * Обновить hash пароля указанного пользователя.
   * @param userId - Id пользователя.
   * @param newHash - обновленный хэш.
   * @returns объект созданного пользователя.
   * **/
  public async updateUserPasswordHash(userId: TPositiveIdSchema, newHash: string): Promise<true> {
    const { manager } = this.dataSource;

    const user = await manager.findOne(UserEntity, {
      where: { id: userId },
    });
    if (!user) throw new NotFoundException(`Пользователь по указанному идентификатору не найден`);

    user.passwordHash = newHash;
    await manager.save(user);

    return true;
  }

  /**
   * Обновить данные пользователя.
   * @param userId - Id пользователя.
   * @param body - данные для обновления.
   * @returns объект обновленного пользователя.
   * **/
  public async updateUser(
    userId: TPositiveIdSchema,
    body: TUpdateUserBodySchema,
  ): Promise<TUserBase> {
    const { manager } = this.dataSource;

    const user = await manager.findOne(UserEntity, { where: { id: userId } });
    if (!user) throw new NotFoundException(`Пользователь по указанному идентификатору не найден`);

    const updatedUser = await manager.save(Object.assign(user, body));

    return this.userMapper.toModel(updatedUser, { base: true });
  }

  /**
   * Удалить пользователя.
   * @param userId - Id пользователя.
   * @returns void.
   * **/
  public async deleteUser(userId: TPositiveIdSchema): Promise<void> {
    const { manager } = this.dataSource;

    await manager.transaction(async transactionalManager => {
      const user = await transactionalManager.findOne(UserEntity, { where: { id: userId } });
      if (!user) throw new NotFoundException(`Пользователь по указанному идентификатору не найден`);

      await transactionalManager.delete(AuthSessionEntity, { userId: String(userId) });
      await transactionalManager.delete(UserEntity, { id: userId });
    });
  }
}
