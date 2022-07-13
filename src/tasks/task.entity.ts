import { IsDate, IsInt, IsString } from 'class-validator';
import UploadFileEntity from '../appl_list/upload-file/file.upload.pg.entity';
import TaskListEntity from '../task_list/task_list.pg.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export default class TaskEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @IsInt()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true, default: 0 })
  status: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  commentary: string;

  @Column({ nullable: true })
  attachment?: string;

  @Column({ type: 'varchar' })
  @IsString()
  start_address: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  end_address: string;

  @Column({ type: 'date', name: 'due_date', nullable: true })
  due_date: string;

  // @Column({ type: 'varchar', nullable: true })
  // @IsString()
  // assignee: string;

  @CreateDateColumn({ name: 'createed_at', nullable: true })
  @IsDate()
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  @IsDate()
  updated_at: Date;

  @OneToMany(() => UploadFileEntity, (upload) => upload.tasksId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  upload_files: UploadFileEntity[];

  @OneToMany(() => TaskListEntity, (item) => item.tasksId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  task_list: TaskListEntity[];
}
