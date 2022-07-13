import { Entity } from 'typeorm';
import ClientsEntityBase from './clients.entity';

export interface IClientEntity {
  id: number;

  name: string;

  logo: string;

  branches: string;

  email: string;

  description: string;

  created_at: Date;

  updated_at: Date;
}

@Entity({ schema: 'default', name: 'Clients' })
export default class ClientsEntity
  extends ClientsEntityBase
  implements IClientEntity
{
  name: string;
  logo: string;
  branches: string;
  description: string;
  insert_date: Date;
  email: string;
}
