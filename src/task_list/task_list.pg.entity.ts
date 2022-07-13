import { Entity } from 'typeorm';
import TaskListEntityBase from './task_list.entity';

export interface ITasklistEntity {
  id: number;

  name: string;

  updatedAt: Date;

  createdAt: Date;

  tasksId: number;
}
@Entity({ schema: 'default', name: 'Task_list' })
export default class TaskListEntity
  extends TaskListEntityBase
  implements ITasklistEntity
{
  createdAt: Date;
  name: string;
  updatedAt: Date;
  tasksId: number;
}
