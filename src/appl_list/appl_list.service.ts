import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TaskEntity from '../tasks/task.pg.entity';
import { Repository } from 'typeorm';
import { FilterSearchDto } from './dto/app-list.search.dto';
import { AppCreateDto } from './dto/app_create.dto';
import UploadFileEntity from './upload-file/file.upload.pg.entity';
import { FileUploadService } from './upload-file/file.upload.service';

@Injectable()
export class ApplListService {
  constructor(
    @InjectRepository(UploadFileEntity)
    private uploadFileRepasitory: Repository<UploadFileEntity>,
    private readonly uploadService: FileUploadService,
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  // create application list
  async createApplicationList(data: AppCreateDto) {
    try {
      return await this.taskRepository.save(this.taskRepository.create(data));
    } catch (error) {
      Logger.log('error=> create application list', error);
      throw error;
    }
  }

  // update application list , edit
  async updateApplicationList(id: number, _data: AppCreateDto, _file) {
    try {
      await this.getApplication(id);

      return 0;
    } catch (error) {
      Logger.log('error=> update application list', error);
      throw error;
    }
  }

  // search app list
  async searchAppList(query: FilterSearchDto) {
    try {
      const [result, count] = await this.taskRepository
        .createQueryBuilder('appl_list')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('appl_list.createed_at', 'DESC')
        .where(
          `lower("appl_list"."title") LIKE lower('${query.beginning || ''}%')`,
        )
        .getManyAndCount();
      return { result, count };
    } catch (error) {
      Logger.log('error=> search application list', error);
      throw error;
    }
  }

  // delete application list
  async deleteApplicationList(id: number) {
    try {
      const app = await this.taskRepository.findOne({ where: { id } });
      if (app.status !== 0) {
        return null;
      }
      await this.uploadService.deleteFileName(id);
      await this.taskRepository.delete(id);
    } catch (error) {
      Logger.log('error=> delete application list', error);
      throw error;
    }
  }

  // get application list
  async getApplication(id: number) {
    try {
      const task = await this.taskRepository
        .createQueryBuilder('tasks')
        .leftJoinAndSelect('tasks.upload_files', 'upload_fileId')
        .andWhere('upload_fileId.tasksId = :id', { id })
        .where('tasks.id = :id', { id })
        .getOne();
      if (task.status !== 0) {
        return null;
      }
      return task;
    } catch (error) {
      Logger.log('error=> get application list by id', error);
      throw error;
    }
  }

  // get all application list
  async getAllApplicationLists() {
    try {
      const [result, count] = await this.taskRepository.findAndCount({
        where: { status: 0 },
      });
      return [result, count];
    } catch (error) {
      Logger.log('error=> get all application list', error);
      throw error;
    }
  }
}
