import { forwardRef, Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import ClientsEntity from './clients.pg.entity';
import UploadFileEntity from '../appl_list/upload-file/file.upload.pg.entity';
import { FileUploadService } from '../appl_list/upload-file/file.upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientsEntity]),
    TypeOrmModule.forFeature([UploadFileEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [ClientsService, FileUploadService],
  controllers: [ClientsController],
})
export class ClientsModule {}
