import { Entity } from 'typeorm';
import TaskEntityBase from './task.entity';

export interface ITaskEntity {
  id: number;
  title: string;
  description: string;
  start_address: string;
  end_address: string;
  due_date: string;
  attachment?: any;
  createed_at: Date;
  updated_at: Date;
  status: number;
}
@Entity({ schema: 'default', name: 'Task' })
export default class TaskEntity extends TaskEntityBase implements ITaskEntity {
  id: number;
  attachment?: any;
  due_date: string;
  createed_at: Date;
  updated_at: Date;
  title: string;
}
