import {
  Body,
  Controller,
  Post,
  Res,
  UnprocessableEntityException,
  HttpStatus,
  Get,
  Request,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  Delete,
  Put,
  Param,
  NotFoundException,
  BadRequestException,
  Query,
  ParseIntPipe,
  Req,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RealIp } from 'nestjs-real-ip';
import { AuthService } from '../auth/auth.service';
import { Roles } from '../shared/decorators/roles';
import { HashPassword } from '../shared/password-hash/password-hash';
import { UserValidator } from '../shared/validaters/user-validator';
import { UserRoles } from '../types/roles';
import { StaffCreateDto } from './dto/staff.register.dto';
import { UserLoginDto } from './dto/user.dto.login';
import { UserBodyRegisterDto } from './dto/user.dto.register.body';
import UserEntityBase from './users.entity';
import { UsersService } from './users.service';
import { sendEmail } from '../email/sendEmail';
import { FilterSearchDto } from '../appl_list/dto/app-list.search.dto';
import { GetUserDto } from './dto/get.user.dto';
import { UpdateMeDto } from './dto/update.me.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly passwordHashing: HashPassword,
    private readonly userValidator: UserValidator,
  ) {}

  @UsePipes(new ValidationPipe())
  @Roles(UserRoles.superAdmin)
  @ApiBearerAuth()
  @ApiQuery({ name: 'role', enum: UserRoles })
  @Post('/register')
  async register(
    @Body() body: UserBodyRegisterDto,
    @Res() res: Response,
    @Request() req,
    @Query('role') role: UserRoles = UserRoles.staff,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      this.userValidator.userEmail(body.email);
      const token = (req.headers['authorization'] + '').split(' ')[1];
      if (!token) {
        throw new NotFoundException('Token does not exist !!!');
      }
      if (!(await this.authService.autorizationSuperAdmin(token))) {
        throw new UnauthorizedException('Admin not authorized !!!');
      }
      const verifayEmail = await this.userService.getUserByEmail(
        body.email.toLowerCase(),
      );
      if (verifayEmail) {
        throw new UnprocessableEntityException(
          'User with this email already exists!!!',
        );
      }
      // await this.userValidator.userPhone(body.phone);
      // if (body.retPassword !== body.password) {
      //   throw new BadRequestException('Passwords do not match!!!');
      // }

      // const passwordHash = await this.passwordHashing.PasswordHash(
      //   body.password,
      // );

      const userRole = await this.userValidator.roleValidator(role);

      await this.userService.addUser({
        name: body.name,
        email: body.email.toLowerCase(),
        phone: body.phone,
        role: userRole,
      });

      return res.status(HttpStatus.CREATED).json({
        success: true,
        name: body.name,
      });
    } catch (error) {
      throw error;
    }
  }
  @UsePipes(new ValidationPipe())
  @Roles(UserRoles.superAdmin)
  @ApiBearerAuth()
  @Post('/create-staff')
  async staffRegister(
    @Body() body: StaffCreateDto,
    @Res() res: Response,
    @Request() req,
  ) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      if (!token) {
        throw new NotFoundException('Token does not exist !!!');
      }
      const payload = await this.authService.decodeToken(token);
      console.log('payload  =>  ', payload);
      const user = await this.authService.validateUser(payload, token);
      console.log('user  =>  ', user);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }

      // phone validator
      await this.userValidator.userPhone(body.phone);
      // email validator
      this.userValidator.userEmail(body.email);
      const verifayEmail = await this.userService.getUserByEmail(
        body.email.toLowerCase(),
      );
      if (verifayEmail) {
        throw new UnprocessableEntityException(
          'User with this email already exists!!!',
        );
      }

      // role output number
      const staffRole = await this.userValidator.roleValidator(body.role);

      await this.userService.addNewStaff({
        name: body.name,
        email: body.email.toLowerCase(),
        phone: body.phone,
        role: staffRole,
      });
      sendEmail(body.email.toLowerCase());
      return res.status(HttpStatus.CREATED).json({
        success: true,
        email: body.email,
      });
    } catch (error) {
      throw error;
    }
  }

  // get one application list
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Get('/search')
  async getUsers(
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
      const users = await this.userService.searchUsers(query);
      if (!users) {
        throw new UnprocessableEntityException('User is not exist!!!');
      }
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      throw error;
    }
  }

  // // get user by query
  // @UsePipes(new ValidationPipe())
  // @ApiBearerAuth()
  // @Get('/')
  // async getUser(
  //   @Request() req,
  //   @Query() query: UserSearchDto,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const token = (req.headers['authorization'] + '').split(' ')[1];
  //     if (!token) {
  //       throw new NotFoundException('Token does not exist!!!');
  //     }
  //     const payload = await this.authService.decodeToken(token);
  //     const userToken = await this.authService.validateUser(payload, token);

  //     const tokenId = await this.authService.afterDecode(token);
  //     if (!tokenId) {
  //       throw new BadRequestException('Something went wrong!!!');
  //     }
  //     let user: UserEntityBase[];

  //     if (
  //       query.email !== undefined ||
  //       query.id !== undefined ||
  //       query.name !== undefined
  //     ) {
  //       if (!(await this.authService.userRoleOut(userToken))) {
  //         throw new UnauthorizedException('User is not unauthorized!!!');
  //       }
  //       user = await this.userService.getUserByQueryOff(query);
  //     }
  //     if (!user) {
  //       const userd = await this.userService.getUserById(tokenId);
  //       return res.status(HttpStatus.OK).json(userd);
  //     }
  //     return res.status(HttpStatus.OK).json(user);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // get all users

  @ApiBearerAuth()
  @Get('all')
  async getAllUsers(@Res() res: Response) {
    try {
      const allUsers = await this.userService.getAllUsers();
      if (!allUsers) {
        throw new UnprocessableEntityException('Users is not exist!!!');
      }
      res.status(HttpStatus.OK).json(allUsers);
    } catch (error) {
      throw error;
    }
  }
  // get me
  @ApiBearerAuth()
  @Get('/me')
  async getMe(@Res() res: Response, @Request() req) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      if (!token) {
        throw new NotFoundException('Token does not exist!!!');
      }
      const payload = this.authService.decodeToken(token);
      this.authService.validateUser(payload, token);

      const tokenId = await this.authService.afterDecode(token);
      if (!tokenId) {
        throw new BadRequestException('Something went wrong!!!');
      }
      const user = await this.userService.getUserByQueryOff(tokenId);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      throw error;
    }
  }

  // user login
  @UsePipes(new ValidationPipe())
  @Post('/login')
  async userLogin(
    @RealIp() ip: string,
    @Body() body: UserLoginDto,
    @Res() res: Response,
  ) {
    try {
      const user: UserEntityBase = await this.userService.getUserByEmail(
        body.email.toLowerCase(),
      );
      if (!user) {
        throw new BadRequestException(
          `User with this email(${body.email}) does not exist !`,
        );
      }

      const isMatch = await this.passwordHashing.IsMutchPassword(
        body.password,
        user.password,
      );
      if (!isMatch) {
        throw new BadRequestException(
          ' Password is wrong!!! \n Please write again!!!',
        );
      }
      const token = await this.authService.login(user, ip);
      if (!token) {
        throw new NotFoundException('Token does not exist !!!');
      }
      await this.userService.insertToken(token, user.id);
      return res.status(HttpStatus.OK).json({
        access_token: token,
      });
    } catch (error) {
      throw error;
    }
  }

  //logout
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Get('logout')
  // @UseGuards(UserAuthGuard)
  async logout(@Res() res: Response, @Request() req) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      if (!token) {
        throw new NotFoundException('Token does not exist !!!');
      }
      const decId = await this.authService.afterDecode(token);
      if (!decId) {
        throw new NotFoundException('Decode id does not exist !!!');
      }
      const user = await this.userService.getUserById(decId);
      if (user.token !== token) {
        throw new BadRequestException('Token is removed!!!');
      }
      if (!user.token || !user) {
        throw new BadRequestException('User is not defined!!!');
      }
      await this.userService.deleteToken(user.id);
      return res.status(HttpStatus.RESET_CONTENT).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }

  // get by id
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
      if (!token) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.userRoleOut(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const userGet = await this.userService.getUserByQueryOff(id);
      if (!userGet) {
        throw new BadRequestException('user is not exist!!!');
      }
      return res.status(HttpStatus.OK).json(userGet);
    } catch (error) {
      throw error;
    }
  }

  // update me endpoint
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Put('/me')
  async updateMeEndpoint(
    @Res() res: Response,
    @Body() body: UpdateMeDto,
    @Request() req,
  ) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      if (!token) {
        throw new UnauthorizedException('User is not authorized!!!');
      }
      const tokenId = await this.authService.afterDecode(token);
      if (!tokenId) {
        throw new UnauthorizedException('User ID is not exist!!!');
      }
      const thisUser = await this.userService.getUserById(tokenId);
      // phone validator
      await this.userValidator.userPhone(body.phone);
      // email validator
      this.userValidator.userEmail(body.email);
      if (thisUser.email !== body.email.toLowerCase()) {
        const verifayEmail = await this.userService.getUserByEmail(
          body.email.toLowerCase(),
        );
        if (verifayEmail) {
          throw new UnprocessableEntityException(
            `this email (${body.email}) already exists!!!`,
          );
        }
      }

      await this.userService.updateMe(tokenId, {
        name: body.name,
        email: body.email.toLowerCase(),
        phone: body.phone,
      });
      return res.status(HttpStatus.ACCEPTED).json({
        success: true,
        name: body.name,
      });
    } catch (error) {
      throw error;
    }
  }

  // user update
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  // @ApiQuery({ name: 'role', enum: UserRoles })
  @Put('/:id')
  async updateUser(
    @Res() res: Response,
    @Body() body: UserBodyRegisterDto,
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    // @Query('role') role: StaffRoles = StaffRoles.driver,
  ) {
    try {
      let user: UserEntityBase;
      let userId: number;
      const token = req.headers.authorization.replace('Bearer ', '');
      if (!token) {
        throw new UnauthorizedException('User is not authorized!!!');
      }
      const tokenId = await this.authService.afterDecode(token);
      if (!tokenId) {
        throw new UnauthorizedException('User ID is not exist!!!');
      }
      if (id) {
        userId = id;
        const user: GetUserDto = await this.userService.getUserByQueryOff(id);
        if (!user) {
          throw new NotFoundException('User is not found!!!');
        }
      } else {
        userId = tokenId;
      }

      await this.userService.updateUser(userId, {
        name: body.name || user.name,
        email: body.email.toLowerCase() || user.email,
        phone: body.phone || user.phone,
        role: body.role || user.role,
      });
      return res.status(HttpStatus.OK).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }

  // change password
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Patch('/change-password')
  async changePassword(
    @Res() res: Response,
    @Body() body: ChangePasswordDto,
    @Request() req,
  ) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      if (!token || token.length < 15) {
        throw new UnauthorizedException('User is not authorized!!!');
      }
      const tokenId = await this.authService.afterDecode(token);
      if (!tokenId) {
        throw new UnauthorizedException('User ID is not exist!!!');
      }
      const user = await this.userService.getUserById(tokenId);

      const isMatch = await this.passwordHashing.IsMutchPassword(
        body.oldPassword,
        user.password,
      );

      if (!isMatch) {
        throw new BadRequestException(
          ' Password is wrong!!! \n Please write again!!!',
        );
      }
      const passwordHash = await this.passwordHashing.PasswordHash(
        body.newPassword,
      );
      await this.userService.updateUser(tokenId, {
        password: passwordHash,
      });
      return res.status(HttpStatus.CREATED).send('Password changed!!!');
    } catch (error) {
      throw error;
    }
  }

  // delete user
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Delete('/:id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Request() req,
  ) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');

      if (!token) {
        throw new UnauthorizedException('user is not authorized');
      }
      if (!(await this.authService.autorizationSuperAdmin(token))) {
        throw new UnauthorizedException('Admin not authorized !!!');
      }
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new NotFoundException('User is not found !');
      }
      await this.userService.deleteUser(id);
      return res.status(HttpStatus.NO_CONTENT).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
