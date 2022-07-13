import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from '../config/database.config.service';
// import { DatabaseConfigService } from '../config/database.config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useExisting: DatabaseConfigService,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
