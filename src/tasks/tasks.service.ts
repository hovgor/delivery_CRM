import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterSearchDto } from '../appl_list/dto/app-list.search.dto';
import UploadFileEntity from '../appl_list/upload-file/file.upload.pg.entity';
import TaskListEntity from '../task_list/task_list.pg.entity';
import { TaskListService } from '../task_list/task_list.service';
import { Repository } from 'typeorm';
import { TaskCreateDto } from './dto/task.create.dto';
import { UpdateStatusDto } from './dto/update.status.dto';
import TaskEntity from './task.pg.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    private readonly taskListService: TaskListService,
    @InjectRepository(TaskListEntity)
    private taskListRepository: Repository<TaskListEntity>,
    @InjectRepository(UploadFileEntity)
    private uploadFileRepository: Repository<UploadFileEntity>,
  ) {}

  // create task
  async createTask(data: TaskCreateDto) {
    try {
      return await this.taskRepository.save(this.taskRepository.create(data));
    } catch (error) {
      Logger.log('error=> create task', error);
      throw error;
    }
  }

  // delete task
  async deleteTask(id: number) {
    try {
      await this.taskRepository.delete(id);
    } catch (error) {
      Logger.log('error=> delete task by id', error);
      throw error;
    }
  }

  // update task
  async updateTask(id: number, data: TaskCreateDto) {
    try {
      return await this.taskRepository.update({ id }, data);
    } catch (error) {
      Logger.log('error=> update task by id', error);
      throw error;
    }
  }

  // update task status
  async updateTaskStatus(id: number, data: UpdateStatusDto) {
    try {
      return await this.taskRepository.update({ id }, data);
    } catch (error) {
      Logger.log('error=> update task status', error);
      throw error;
    }
  }

  // search task
  async searchTasks(query: FilterSearchDto) {
    try {
      const [result, count] = await this.taskRepository
        .createQueryBuilder('tasks')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('tasks.createed_at', 'DESC')
        .where(`lower("tasks"."name") LIKE lower('${query.beginning || ''}%')`)
        .getManyAndCount();
      return { result, count };
    } catch (error) {
      Logger.log('error=> search tasks', error);
      throw error;
    }
  }

  // get task
  async getTask(id: number) {
    try {
      const task = await this.taskRepository
        .createQueryBuilder('tasks')
        .leftJoinAndSelect('tasks.upload_files', 'upload_fileId')
        .andWhere('upload_fileId.tasksId = :id', { id })
        .where('tasks.id = :id', { id })
        .getOne();
      if (task.status === 0) {
        throw new UnprocessableEntityException(
          '\nThis task is a application whit status 0!!!\t\nPlease try again!!!',
        );
      }
      return task;
    } catch (error) {
      Logger.log('error=> get task by id', error);
      throw error;
    }
  }

  // get all task
  async getAllTask() {
    try {
      const tasks: TaskEntity[] = await this.taskRepository.find();
      const result = [];
      for (let i = 0; i < tasks.length; ++i) {
        if (tasks[i].status === 0) {
          continue;
        }
        result.push(tasks[i]);
      }
      return result;
    } catch (error) {
      Logger.log('error=> get all tasks', error);
      throw error;
    }
  }
}
