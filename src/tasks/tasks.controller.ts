import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UnprocessableEntityException,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FilterSearchDto } from '../appl_list/dto/app-list.search.dto';
import { FileUploadService } from '../appl_list/upload-file/file.upload.service';
import { AuthService } from '../auth/auth.service';
import { TaskListService } from '../task_list/task_list.service';
import { TaskCreateDto } from './dto/task.create.dto';
import TaskEntity from './task.pg.entity';
import { TasksService } from './tasks.service';
import { UpdateStatusDto } from './dto/update.status.dto';

export const storage1 = {
  storage: diskStorage({
    destination: `./upload-file/tasks`,
    filename: async (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  findAll(): any {
    throw new Error('Method not implemented.');
  }
  constructor(
    private authService: AuthService,
    private taskService: TasksService,
    private fileUploadService: FileUploadService,
    private taskListService: TaskListService,
  ) {}

  // create task
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'attachment', maxCount: 4 }], storage1),
  )
  @ApiQuery({ name: 'taskListId' })
  @Post('/')
  async createTask(
    @Req() req,
    @Res() res: Response,
    @UploadedFiles() files,
    @Query() reqQuery,
    @Body() body: TaskCreateDto,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const id: number = reqQuery.taskListId;
      if (!id) {
        throw new NotFoundException('Task list id is not exist!!!');
      }
      const taskList = await this.taskListService.getOneTaskList(id);
      if (!taskList) {
        throw new NotFoundException('List is not found!!!');
      }
      const task: TaskEntity = await this.taskService.createTask({
        title: body.title,
        description: body.description,
        start_address: body.start_address,
        end_address: body.end_address,
        status: id,
        due_date: body.due_date,
      });
      await this.fileUploadService.addFileForTasks(files.attachment, task.id);
      return res.status(HttpStatus.CREATED).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }

  // update task status
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Patch('update-status/:task_id')
  async updateTaskStatus(
    @Req() req,
    @Res() res: Response,
    @Body() body: UpdateStatusDto,
    @Param('task_id', ParseIntPipe) task_id: number,
  ) {
    const token = (req.headers['authorization'] + '').split(' ')[1];
    const payload = await this.authService.decodeToken(token);
    const user = await this.authService.validateUser(payload, token);
    if (!(await this.authService.userAndDriverRoleOut(user))) {
      throw new UnauthorizedException('User is not unauthorized!!!');
    }
    const getTask = await this.taskService.getTask(task_id);
    if (!getTask) {
      throw new UnprocessableEntityException('The task is not exist!!!');
    }
    const task = {
      status: body.status,
    };
    const taskStatus = await this.taskService.updateTaskStatus(
      getTask.id,
      task,
    );
    return res.status(HttpStatus.ACCEPTED).json({
      success: true,
      taskStatus,
    });
  }

  // update task
  @Put(':id')
  @ApiBearerAuth()
  async updateTask(
    @Req() req,
    @Res() res: Response,
    @Query() reqQuery,
    @Body() body: TaskCreateDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);
      if (!(await this.authService.userAndDriverRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const taskListId = reqQuery.taskListId;
      const taskList = await this.taskListService.getOneTaskList(+taskListId);
      if (!taskList) {
        throw new NotFoundException('List is not found!!!');
      }
      const updateTask = await this.taskService.getTask(id);
      if (!updateTask) {
        throw new NotFoundException('Task is not found!!!');
      }
      const task: TaskEntity | any = {
        title: body.title || updateTask.title,
        description: body.description || updateTask.description,
        end_address: body.end_address || updateTask.end_address,
        start_address: body.start_address || updateTask.start_address,
        status: body.status || updateTask.status,
        due_date: body.due_date || updateTask.due_date,
      };
      await this.taskService.updateTask(updateTask.id, task);
      return res.status(HttpStatus.ACCEPTED).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }

  // get all tasks
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Get('all')
  async getAllTask(@Req() req, @Res() res: Response) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);
      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }

      const getTasks = await this.taskService.getAllTask();
      if (!getTasks) {
        throw new BadRequestException('Tasks is not exist!!!');
      }
      return res.status(HttpStatus.OK).json(getTasks);
    } catch (error) {
      throw error;
    }
  }

  // get search
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Get('/search')
  async getTaskSearch(
    @Req() req,
    @Res() res: Response,
    @Query() query: FilterSearchDto,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);
      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const tasks = await this.taskService.searchTasks(query);
      if (!tasks) {
        throw new UnprocessableEntityException('Task is not exist!!!');
      }
      return res.status(HttpStatus.OK).json(tasks);
    } catch (error) {
      throw error;
    }
  }

  // get task
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Get(':id')
  async getTask(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const getTask = await this.taskService.getTask(id);
      if (!getTask) {
        throw new BadRequestException('Task is not exist!!!');
      }
      return res.status(HttpStatus.OK).json(getTask);
    } catch (error) {
      throw error;
    }
  }

  // delete tas
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Delete(':id')
  async deleteTask(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);
      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const getTask = await this.taskService.getTask(id);
      if (!getTask) {
        throw new NotFoundException('Task is not exist!!!');
      }
      await this.taskService.deleteTask(getTask.id);
      return res.status(HttpStatus.NO_CONTENT).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
