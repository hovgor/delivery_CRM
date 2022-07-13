import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ApplListController } from './appl_list.controller';
import { ApplListService } from './appl_list.service';
import { FileUploadService } from './upload-file/file.upload.service';
import UploadFileEntity from './upload-file/file.upload.pg.entity';
import TaskEntity from '../tasks/task.pg.entity';
import { TasksService } from '../tasks/tasks.service';
import TaskListEntity from '../task_list/task_list.pg.entity';
import { TaskListService } from '../task_list/task_list.service';
import TasksSocketController from './appl_list.socket.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, TaskListEntity, UploadFileEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ApplListController],
  providers: [
    ApplListService,
    FileUploadService,
    TasksService,
    TaskListService,
    TasksSocketController,
  ],
})
export class ApplListModule {}
