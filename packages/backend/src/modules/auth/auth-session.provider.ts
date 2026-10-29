import { TUser } from '@kanban-board/common';
import {
  AuthenticationRegistry,
  SessionCookieProvider,
  type SessionRecord,
} from '@nestjs/authentication';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import UserService from '@/modules/user/user.service';

@Injectable()
export default class AuthSessionProvider extends SessionCookieProvider<TUser> {
  constructor(
    private userService: UserService,
    registry: AuthenticationRegistry,
  ) {
    super();
    registry.registerProvider(this);
  }

  protected validate(
    session: SessionRecord,
  ): TUser | Promise<TUser | null | undefined> | null | undefined {
    if (!session) throw new InternalServerErrorException('Сессия не найдена');

    const userIdInt = parseInt(session.userId);
    if (isNaN(userIdInt))
      throw new BadRequestException(
        'Идентификатор пользователя должен быть целым положительным числом',
      );

    return this.userService.getUserBy(userIdInt);
  }
}
