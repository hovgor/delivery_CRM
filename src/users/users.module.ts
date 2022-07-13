import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { HashPassword } from '../shared/password-hash/password-hash';
import { UserValidator } from '../shared/validaters/user-validator';
import UserEntity from './users.pg.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, HashPassword, UserValidator],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
