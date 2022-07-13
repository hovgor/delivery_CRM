import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterSearchDto } from '../appl_list/dto/app-list.search.dto';
import { Repository } from 'typeorm';
import { GetUserDto } from './dto/get.user.dto';
import { UpdateMeDto } from './dto/update.me.dto';
import { UserRegisterDto } from './dto/user.dto.register';
import UserEntity from './users.pg.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    public userRepository: Repository<UserEntity>,
  ) {}

  // add user
  async addUser(data: UserRegisterDto) {
    try {
      return await this.userRepository.save(this.userRepository.create(data));
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }

  async addNewStaff(data: any) {
    try {
      return await this.userRepository.save(this.userRepository.create(data));
    } catch (error) {
      Logger.log('error=> add staff crud', error);
      throw error;
    }
  }

  // get user
  async getUserByQueryOff(query: number): Promise<GetUserDto | any> {
    try {
      const user = await this.userRepository.findOne({ where: { id: query } });

      const returnUser = {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      };
      return returnUser;
    } catch (error) {
      Logger.log('error=> get off function ', error);
      throw error;
    }
  }

  // get user by email
  async getUserByEmail(email: string) {
    try {
      return await this.userRepository.findOne({ where: { email: email } });
    } catch (error) {
      Logger.log('error=> get user by email', error);
      throw error;
    }
  }
  // get user by id
  async getUserById(id: number) {
    try {
      return await this.userRepository.findOne({ where: { id: id } });
    } catch (error) {
      Logger.log('error=> get user by id');
      throw error;
    }
  }

  // get users by query
  async getUsersByQuery(query: any) {
    try {
      return await this.userRepository.find(query);
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }

  // get all users
  async getAllUsers() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw error;
    }
  }

  // update user
  async updateUser(id: number, data: any) {
    try {
      return await this.userRepository.update({ id }, data);
    } catch (error) {
      Logger.log('error=> update user', error);
      throw error;
    }
  }

  // update me
  async updateMe(id: number, data: UpdateMeDto) {
    try {
      return await this.userRepository.update({ id: id }, data);
    } catch (error) {
      Logger.log('error=> update me', error);
      throw error;
    }
  }

  // insert token in db
  async insertToken(token: string, id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id: id } });
      user.token = token;
      return await this.userRepository.save(user);
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }

  // delete token in db
  async deleteToken(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      user.token = null;
      return await this.userRepository.save(user);
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }
  // search users
  async searchUsers(query: FilterSearchDto) {
    try {
      const [result, count] = await this.userRepository
        .createQueryBuilder('users')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('users.created_at', 'DESC')
        .where(`lower("users"."name") LIKE lower('${query.beginning || ''}%')`)
        .getManyAndCount();
      return { result, count };
    } catch (error) {
      Logger.log('error=> search application list', error);
      throw error;
    }
  }

  // delete user
  async deleteUser(id: number) {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }
}
