import { UserRoles } from '../types/roles';
import { Column, Entity } from 'typeorm';
import UserEntityBase from './users.entity';

export interface IUserEntity {
  id: number;

  name: string;

  token: string;

  password: string;

  email: string;

  phone: string;

  role: UserRoles;

  updatedAt: Date;

  createdAt: Date;
}

@Entity({ schema: 'default', name: 'Users' })
export default class UserEntity extends UserEntityBase implements IUserEntity {
  @Column({ type: 'varchar', nullable: true })
  public firebaseToken: string;
}
