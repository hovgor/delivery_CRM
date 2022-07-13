import { IsDate, IsInt, IsString } from 'class-validator';
import UploadFileEntity from '../appl_list/upload-file/file.upload.pg.entity';
import { UserRoles } from '../types/roles';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export default class ClientsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @IsInt()
  id: number;

  @Column({ type: 'varchar' })
  @IsString()
  title: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  logo: string;

  @Column({ type: 'varchar' })
  @IsString()
  branches: string;

  @Column({ type: 'varchar' })
  @IsString()
  email: string;

  @Column({ type: 'varchar' })
  @IsString()
  description: string;

  @Column({ type: 'date', default: '12/02/1997' })
  @IsDate()
  due_date: string;

  @Column({ type: 'smallint', default: UserRoles.client })
  @IsInt()
  role: UserRoles;

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

  @OneToMany(() => UploadFileEntity, (upload) => upload.clientId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  upload_files: UploadFileEntity[];
}
