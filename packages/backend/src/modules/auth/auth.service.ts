import {
  sleep,
  type TAuthData,
  type TAuthLoginPayload,
  type TAuthRegister,
} from '@kanban-board/common';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import UserService from '@/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private dataSource: DataSource,
  ) {}

  public async register(body: TAuthRegister): Promise<TAuthData> {
    await sleep(1000);
    console.log(body);
    return { login: '123', password: '123' };
  }

  public async login(body: TAuthData): Promise<TAuthLoginPayload> {
    await sleep(1000);
    console.log(body);
    return { token: '123' };
  }
}
