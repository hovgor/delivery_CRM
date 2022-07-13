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
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UnprocessableEntityException,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FilterSearchDto } from '../appl_list/dto/app-list.search.dto';
import { AuthService } from '../auth/auth.service';
import { ClientsService } from './clients.service';
import { ClientCreteDto } from './dto/client.create.dto';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadService } from '../appl_list/upload-file/file.upload.service';
import { BodyDataDto } from './dto/body.data.dto';

export const storage2 = {
  storage: diskStorage({
    destination: `./upload-file/clients-logo`,
    filename: async (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('clients')
@ApiTags('Clients')
export class ClientsController {
  constructor(
    private clientService: ClientsService,
    private readonly fileUploadService: FileUploadService,
    private authService: AuthService,
  ) {}

  // create task
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }], storage2),
  )
  @Post('/')
  async createClient(
    @Req() req,
    @Res() res: Response,
    @Body() body: BodyDataDto,
    @UploadedFiles() file,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const newClient = await this.clientService.createClient({
        title: body.title,
        branches: body.branches,
        description: body.description,
        email: body.email,
      });
      if (!newClient) {
        throw new NotFoundException('Something went wrong!!!');
      }

      const uploadLogo = await this.fileUploadService.addFileForClients(
        file.logo,
        newClient.id,
      );
      if (!uploadLogo) {
        throw new UnprocessableEntityException(
          'you are whant upload file but file dose not exist',
        );
      }
      return res
        .status(HttpStatus.CREATED)
        .json({ success: true, client: newClient });
    } catch (error) {
      throw error;
    }
  }

  // get all clients
  @ApiBearerAuth()
  @Get('all')
  async getAllClient(@Req() req, @Res() res: Response) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const client = await this.clientService.getAllClient();
      if (!client) {
        throw new NotFoundException('Something went wrong!!!');
      }
      return res.status(HttpStatus.OK).json(client);
    } catch (error) {
      throw error;
    }
  }

  // get search
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Get('/search')
  async getClientsSearch(
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
      const clients = await this.clientService.searchClients(query);
      if (!clients) {
        throw new UnprocessableEntityException('Clients has not exist!!!');
      }
      return res.status(HttpStatus.OK).json(clients);
    } catch (error) {
      throw error;
    }
  }

  // get one client
  @ApiBearerAuth()
  @Get(':id')
  async getClient(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const client = await this.clientService.getClient(id);
      if (!client) {
        throw new BadRequestException('Client dose not exist!!!');
      }
      return res.status(HttpStatus.OK).json(client);
    } catch (error) {
      throw error;
    }
  }

  // update client
  @ApiBearerAuth()
  @Put(':id')
  async updateClient(
    @Req() req,
    @Res() res: Response,
    @Body() body: ClientCreteDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const client = await this.clientService.getClient(id);
      if (!client) {
        throw new BadRequestException('Client dose not exist!!!');
      }
      const newData: ClientCreteDto = {
        title: body.title || client.title,
        logo: body.logo || client.logo,
        branches: body.branches || client.branches,
        description: body.description || client.description,
        email: body.email || client.email,
      };
      if (!newData) {
        throw new NotFoundException('Something went wrong!!!');
      }
      await this.clientService.updateClient(client.id, newData);
      return res
        .status(HttpStatus.CREATED)
        .json({ success: true, new_data: newData });
    } catch (error) {
      throw error;
    }
  }

  // delete client
  @ApiBearerAuth()
  @Delete(':id')
  async deleteClient(
    @Req() req,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const client = await this.clientService.getClient(id);
      if (!client) {
        throw new BadRequestException('Client dose not exist!!!');
      }
      await this.clientService.deleteClient(id);
      return res.status(HttpStatus.NO_CONTENT).json({ success: true });
    } catch (error) {
      throw error;
    }
  }
}
