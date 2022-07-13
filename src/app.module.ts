import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
// import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TaskListModule } from './task_list/task_list.module';
import { TasksModule } from './tasks/tasks.module';
import { ApplListModule } from './appl_list/appl_list.module';
import { ClientsModule } from './clients/clients.module';
import { HashPassword } from './shared/password-hash/password-hash';
import { UserValidator } from './shared/validaters/user-validator';
import UserEntity from './users/users.pg.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    TaskListModule,
    TasksModule,
    ApplListModule,
    ClientsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, HashPassword, UserValidator],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
