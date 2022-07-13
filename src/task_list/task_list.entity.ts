import { IsDate, IsInt } from 'class-validator';
import TaskEntity from '../tasks/task.pg.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export default class TaskListEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @IsInt()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'createed_at' })
  @IsDate()
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  updated_at: Date;

  @ManyToOne(() => TaskEntity, (tasks) => tasks.task_list, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tasks: TaskEntity;
}
