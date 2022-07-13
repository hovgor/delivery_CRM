import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskListCreateDto } from './dto/task_list.create.dto';
import TaskListEntity from './task_list.pg.entity';

@Injectable()
export class TaskListService {
  constructor(
    @InjectRepository(TaskListEntity)
    private taskListRepository: Repository<TaskListEntity>,
  ) {}

  // create task list
  async createTaskList(data: TaskListCreateDto) {
    try {
      return await this.taskListRepository.save(
        this.taskListRepository.create(data),
      );
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }

  // delete task list
  async deleteTaskList(id: number) {
    try {
      await this.taskListRepository.delete(id);
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }

  // get one task list
  async getOneTaskList(id: number) {
    try {
      if (!id) {
        throw new UnprocessableEntityException('ID is not defined!!!');
      }
      return await this.taskListRepository.findOne({ where: { id: id } });
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }

  // get all task lists
  async getAllTaskLists() {
    try {
      return await this.taskListRepository.find();
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }

  // update task list
  async updateTaskList(id: number, data: TaskListCreateDto) {
    try {
      return await this.taskListRepository.update({ id: id }, data);
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }
}
