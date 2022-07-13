import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UnprocessableEntityException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { TaskListCreateDto } from './dto/task_list.create.dto';
import { TaskListService } from './task_list.service';

@Controller('task-list')
@ApiTags('Task-list')
export class TaskListController {
  constructor(
    private taskListService: TaskListService,
    private authService: AuthService,
  ) {}

  // create task list
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Post('/')
  async createTaskList(
    @Req() req,
    @Res() res: Response,
    @Body() body: TaskListCreateDto,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      await this.taskListService.createTaskList({
        name: body.name,
      });
      return res.status(HttpStatus.CREATED).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }

  // delete task list
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Delete(':id')
  async deleteTakList(
    @Res() res: Response,
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const taskList = await this.taskListService.getOneTaskList(id);
      if (!taskList) {
        throw new UnprocessableEntityException('task list is not exist');
      }
      await this.taskListService.deleteTaskList(id);
      return res.status(HttpStatus.NO_CONTENT).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }

  // get one task list
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Get('all')
  async getAllTakList(@Res() res: Response, @Req() req) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const taskLists = await this.taskListService.getAllTaskLists();
      if (!taskLists) {
        throw new UnprocessableEntityException('task lists is not exist');
      }
      return res.status(HttpStatus.OK).json(taskLists);
    } catch (error) {
      throw error;
    }
  }

  // get one task list
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Get(':id')
  async getTaskList(
    @Res() res: Response,
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const taskList = await this.taskListService.getOneTaskList(id);
      if (!taskList) {
        throw new UnprocessableEntityException('Task list is not exist!!!');
      }
      return res.status(HttpStatus.OK).json(taskList);
    } catch (error) {
      throw error;
    }
  }

  // update task list
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Put(':id')
  async updateTaskList(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: TaskListCreateDto,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const taskList = await this.taskListService.getOneTaskList(id);
      if (!taskList) {
        throw new BadRequestException('task list is not exist');
      }
      const result: TaskListCreateDto = {
        name: body.name,
      };
      await this.taskListService.updateTaskList(taskList.id, result);
      return res.status(HttpStatus.OK).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
