import { Module } from '@nestjs/common';

import UserMapper from '@/modules/user/libs/mappers/user.mapper';

@Module({
  providers: [UserMapper],
  exports: [UserMapper],
})
export default class UserMapperModule {}
