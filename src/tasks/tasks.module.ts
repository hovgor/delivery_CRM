import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskListService } from '../task_list/task_list.service';
import { TaskListModule } from '../task_list/task_list.module';
import { AuthModule } from '../auth/auth.module';
import TaskListEntity from '../task_list/task_list.pg.entity';
import TaskEntity from './task.pg.entity';
import UploadFileEntity from '../appl_list/upload-file/file.upload.pg.entity';
import { FileUploadService } from '../appl_list/upload-file/file.upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, TaskListEntity, UploadFileEntity]),
    forwardRef(() => TaskListModule),
    forwardRef(() => AuthModule),
  ],
  providers: [TasksService, TaskListService, FileUploadService],
  controllers: [TasksController],
})
export class TasksModule {}
