import {
  EUserRole,
  EUserWorkspaceRole,
  EUserWorkspaceStatus,
  RandomUtility,
  type TAuthCredentials,
  type TCreateUser,
  type TPositiveIdSchema,
  type TUpdateUserBodySchema,
  type TUser,
  type TUserWorkspace,
  USER_AVATARS,
} from '@kanban-board/common';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import UserEntity from '@/modules/user/libs/entities/user.entity';
import UserWorkspaceEntity from '@/modules/user/libs/entities/user-workspace.entity';
import UserMapper from '@/modules/user/libs/mappers/user.mapper';
import UserWorkspaceMapper from '@/modules/user/libs/mappers/user-workspace.mapper';

@Injectable()
export default class UserService {
  constructor(
    private dataSource: DataSource,
    private userMapper: UserMapper,
    private userWorkspaceMapper: UserWorkspaceMapper,
  ) {}

  /**
   * Получить пользователя по его Id или логину (перегрузка).
   * @param login - логин или Id пользователя.
   * @returns объект пользователя.
   * **/
  public async getUserBy(login: string): Promise<TUser>;
  public async getUserBy(userId: TPositiveIdSchema): Promise<TUser>;
  public async getUserBy(loginOrId: string | TPositiveIdSchema): Promise<TUser> {
    if (!loginOrId) throw new BadRequestException(`Не указан идентификатор или логин пользователя`);

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

    return this.userMapper.toModel(user);
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
    if (!loginOrId) throw new BadRequestException(`Не указан идентификатор или логин пользователя`);

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
    if (!transactionalManager) throw new BadRequestException('Не передан транзакционный менеджер.');
    if (!body) throw new BadRequestException('Не переданы данные для создания пользователя');

    const { firstName, lastName, workspaceId, login, passwordHash } = body;

    const newUser = transactionalManager.create(UserEntity, {
      firstName,
      lastName,
      login,
      passwordHash,
      systemRole: EUserRole.USER,
      avatar: RandomUtility.getRandomFromArray(USER_AVATARS),
    });

    const createdUser = await transactionalManager.save(newUser);
    if (!createdUser) throw new BadRequestException('Не удалось создать пользователя');

    const newUserWorkspace = transactionalManager.create(UserWorkspaceEntity, {
      workspaceId,
      userId: createdUser.id,
      status: EUserWorkspaceStatus.ACTIVE,
      workspaceRole: EUserWorkspaceRole.OWNER,
    });

    const createdUserWorkspace = await transactionalManager.save(newUserWorkspace);
    if (!createdUserWorkspace)
      throw new BadRequestException('Не удалось привязать пользователя к рабочему пространству');

    return this.userMapper.toModel(createdUser);
  }

  /**
   * Обновить hash пароля указанного пользователя.
   * @param userId - Id пользователя.
   * @param newHash - обновленный хэш.
   * @returns объект созданного пользователя.
   * **/
  public async updateUserPasswordHash(userId: TPositiveIdSchema, newHash: string): Promise<true> {
    if (!userId) throw new BadRequestException(`Не указан идентификатор пользователя`);
    if (!newHash) throw new BadRequestException(`Не указан хэш пароля`);

    const { manager } = this.dataSource;

    const user = await manager.findOne(UserEntity, {
      where: { id: userId },
    });
    if (!user) throw new NotFoundException(`Пользователь по указанному идентификатору не найден`);

    user.passwordHash = newHash;

    const updatedUser = await manager.save(user);
    if (!updatedUser) throw new InternalServerErrorException('Не удалось обновить хэш пароля');

    return true;
  }

  /**
   * Обновить данные пользователя.
   * @param userId - Id пользователя.
   * @param body - данные для обновления.
   * @returns объект обновленного пользователя.
   * **/
  public async updateUser(userId: TPositiveIdSchema, body: TUpdateUserBodySchema): Promise<TUser> {
    if (!userId) throw new BadRequestException(`Не указан идентификатор пользователя`);
    if (!body) throw new BadRequestException(`Не указаны данные для обновления`);

    const { manager } = this.dataSource;

    const user = await manager.findOne(UserEntity, { where: { id: userId } });
    if (!user) throw new NotFoundException(`Пользователь по указанному идентификатору не найден`);

    const updatedUser = await manager.save(Object.assign(user, body));
    if (!updatedUser)
      throw new InternalServerErrorException('Не удалось обновить данные пользователя');

    return this.userMapper.toModel(updatedUser);
  }

  /**
   * Получить рабочее пространство пользователя по Id пользователя.
   * @param userId - Id пользователя.
   * @returns объект рабочего пространства пользователя или null, если оно не найдено.
   * **/
  public async getUserWorkspaceByUserId(userId: TPositiveIdSchema): Promise<TUserWorkspace | null> {
    if (!userId) throw new BadRequestException(`Не указан идентификатор пользователя`);

    const { manager } = this.dataSource;

    const userWorkspace = await manager.findOne(UserWorkspaceEntity, {
      where: { userId },
      relations: { workspace: true },
    });

    if (!userWorkspace) return null;

    return this.userWorkspaceMapper.toModel(userWorkspace);
  }
}
