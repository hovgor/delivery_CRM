import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AuthService } from '../auth/auth.service';
import { ApplListService } from './appl_list.service';
import { FilterSearchDto } from './dto/app-list.search.dto';
import { ApplListCreateDto } from './dto/appl_list.create.dto';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadService } from './upload-file/file.upload.service';
import { TasksService } from '../tasks/tasks.service';
import { UpdateStatusDto } from '../tasks/dto/update.status.dto';
import TasksSocketController from './appl_list.socket.controller';

export const storage = {
  storage: diskStorage({
    destination: `./upload-file/applications`,
    filename: async (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('app-list')
@ApiTags('App-list')
export class ApplListController {
  constructor(
    private readonly applListService: ApplListService,
    private readonly authService: AuthService,
    private readonly fileUploadService: FileUploadService,
    private readonly tasksService: TasksService,
    private readonly ws: TasksSocketController,
  ) {}

  // create application list
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'attachment', maxCount: 4 }], storage),
  )
  @Post('/')
  async createApplList(
    @Req() req,
    @Res() res: Response,
    @UploadedFiles() files,
    @Body() body: ApplListCreateDto,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);
      if (!(await this.authService.adminStaffClientRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const applList: any = await this.applListService.createApplicationList({
        title: body.title,
        description: body.description,
        start_address: body.start_address,
        end_address: body.end_address,
        due_date: body.due_date,
      });

      await this.fileUploadService.addFileForTasks(
        files.attachment,
        applList.id,
      );
      if (!applList) {
        throw new BadRequestException('Something went wrong!!!');
      }
      return res.status(HttpStatus.CREATED).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }
  // update application status
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Patch('update-status/:id')
  async updateApplicationStatus(
    @Req() req,
    @Res() res: Response,
    @Body() body: UpdateStatusDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);
      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const getApplication = await this.applListService.getApplication(id);
      if (!getApplication) {
        throw new UnprocessableEntityException(
          'This application is not exist!!!',
        );
      }
      const appl = {
        status: body.status,
      };
      const appStatus = await this.tasksService.updateTaskStatus(
        getApplication.id,
        appl,
      );
      res.status(HttpStatus.ACCEPTED).json({
        success: true,
        appStatus,
      });
    } catch (error) {
      throw error;
    }
  }

  // update application list whit id
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'attachment', maxCount: 4 }], storage),
  )
  @Put(':id')
  async updateApplList(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApplListCreateDto,
    @UploadedFiles() files,
    @Res() res: Response,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);
      if (!(await this.authService.adminStaffClientRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const applList = await this.applListService.getApplication(id);
      if (!applList) {
        throw new UnprocessableEntityException('List is not exist');
      }
      let file;
      if (files) {
        file = files.attachment;
      }

      const newApplList = await this.applListService.updateApplicationList(
        applList.id,
        {
          title: body.title || applList.title,
          description: body.description || applList.description,
          end_address: body.end_address || applList.end_address,
          start_address: body.start_address || applList.start_address,
          due_date: body.due_date || applList.due_date,
        },
        file,
      );
      if (!newApplList) {
        throw new BadRequestException('Something went wrong!!!');
      }
      return res.status(HttpStatus.ACCEPTED).json({
        success: true,
        update_list: applList.id,
      });
    } catch (error) {
      throw error;
    }
  }

  // get all application lists
  @ApiBearerAuth()
  @Get('all')
  async getAllApplLists(@Req() req, @Res() res: Response) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);
      if (!(await this.authService.adminStaffClientRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const allApplLists = await this.applListService.getAllApplicationLists();
      if (!allApplLists) {
        throw new UnprocessableEntityException('Something went wrong!!!');
      }
      return res.status(HttpStatus.OK).json(allApplLists);
    } catch (error) {
      throw error;
    }
  }
  // get all application pending
  @Get('/pending')
  async getAllAppPending(@Res() res: Response) {
    try {
      const allApplLists = await this.applListService.getAllApplicationLists();
      if (!allApplLists) {
        throw new UnprocessableEntityException('Something went wrong!!!');
      }

      if (Object.keys(this.ws.server.connected).length !== 0) {
        this.ws.server.emit('remind', allApplLists);
      }
      return res.status(HttpStatus.OK).json(allApplLists);
    } catch (error) {
      throw error;
    }
  }

  // get one application list
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Get('/search')
  async getOneApplList(
    @Req() req,
    @Res() res: Response,
    @Query() query: FilterSearchDto,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);
      if (!(await this.authService.adminStaffClientRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const applList = await this.applListService.searchAppList(query);
      if (!applList) {
        throw new UnprocessableEntityException('List is not exist');
      }

      return res.status(HttpStatus.OK).json(applList);
    } catch (error) {
      throw error;
    }
  }

  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Get('/:id')
  async getOneApplListById(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);
      if (!(await this.authService.adminStaffClientRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const applList = await this.applListService.getApplication(id);
      if (!applList) {
        throw new UnprocessableEntityException(
          'List is not exist or this sheet has a status !!!',
        );
      }

      return res.status(HttpStatus.OK).json(applList);
    } catch (error) {
      throw error;
    }
  }

  // delete application list
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Delete(':id')
  async deleteApplList(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);
      if (!(await this.authService.adminStaffClientRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const applList = await this.applListService.getApplication(id);
      if (!applList) {
        throw new UnprocessableEntityException('List is not exist!');
      }
      await this.applListService.deleteApplicationList(id);
      return res.status(HttpStatus.NO_CONTENT).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
