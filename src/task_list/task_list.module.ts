import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import UserEntity from '../users/users.pg.entity';
import { UsersService } from '../users/users.service';
import { TaskListController } from './task_list.controller';
import TaskListEntity from './task_list.pg.entity';
import { TaskListService } from './task_list.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskListEntity, UserEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [TaskListController],
  providers: [TaskListService, UsersService],
  exports: [TaskListService],
})
export class TaskListModule {}
