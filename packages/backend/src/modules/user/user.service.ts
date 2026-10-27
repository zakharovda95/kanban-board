import {
  EUserRole,
  EUserStatus,
  EWorkspaceRole,
  type TAuthCredentials,
  type TCreateUser,
  type TPositiveIdSchema,
  type TUser,
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

@Injectable()
export default class UserService {
  constructor(
    private dataSource: DataSource,
    private userMapper: UserMapper,
  ) {}

  /**
   * Получить пользователя по его Id или логину (перегрузка).
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
      relations: { userWorkspace: true },
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
      workspaceId,
      login,
      passwordHash,
      systemRole: EUserRole.USER,
      status: EUserStatus.ACTIVE,
      avatar: null,
    });

    const createdUser = await transactionalManager.save(newUser);
    if (!createdUser) throw new BadRequestException('Не удалось создать пользователя');

    const newUserWorkspace = transactionalManager.create(UserWorkspaceEntity, {
      workspaceId,
      userId: createdUser.id,
      workspaceRole: EWorkspaceRole.OWNER,
    });

    const createdUserWorkspace = await transactionalManager.save(newUserWorkspace);
    if (!createdUserWorkspace)
      throw new BadRequestException('Не удалось привязать пользователя к рабочему пространству');

    return this.userMapper.toModel(createdUser);
  }

  /**
   * Создать нового пользователя.
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
}
