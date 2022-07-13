import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterSearchDto } from '../appl_list/dto/app-list.search.dto';
import { Repository } from 'typeorm';
import ClientsEntity from './clients.pg.entity';
import { ClientCreteDto } from './dto/client.create.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientsEntity)
    private clientRepository: Repository<ClientsEntity>,
  ) {}

  // create client
  async createClient(data: ClientCreteDto) {
    try {
      return await this.clientRepository.save(
        this.clientRepository.create(data),
      );
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }

  // delete client
  async deleteClient(id: number) {
    try {
      await this.clientRepository.delete(id);
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }

  // get client
  async getClient(id: number) {
    try {
      return await this.clientRepository.findOne({ where: { id: id } });
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }

  // get all client
  async getAllClient() {
    try {
      return await this.clientRepository.find();
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }

  // update client
  async updateClient(id: number, data: ClientCreteDto) {
    try {
      return await this.clientRepository.update({ id: id }, data);
    } catch (error) {
      Logger.log('error=> ', error);
      throw error;
    }
  }

  // search clients
  async searchClients(query: FilterSearchDto) {
    try {
      const [result, count] = await this.clientRepository
        .createQueryBuilder('clients')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('clients.createed_at', 'DESC')
        .where(
          `lower("clients"."title") LIKE lower('${query.beginning || ''}%')`,
        )
        .getManyAndCount();
      return { result, count };
    } catch (error) {
      Logger.log('error=> search clients', error);
      throw error;
    }
  }
}
