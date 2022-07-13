import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigEnum } from './config.enum';
import { ConfigService } from './config.service';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'postgres',
      schema: 'default',
      host: this.configService.get(ConfigEnum.DATABASE_HOST),
      port: this.configService.get(ConfigEnum.DATABASE_PORT),
      username: this.configService.get(ConfigEnum.DATABASE_USERNAME),
      password: this.configService.get(ConfigEnum.DATABASE_PASSWORD),
      database: this.configService.get(ConfigEnum.DATABASE_NAME),
      logging: false,
      entities: [process.cwd(), '**/*.pg.entity.{js, ts}'],
      synchronize: true,
      migrationsRun: false,
      // ssl: {
      //   rejectUnauthorized: false,
      // },
    };
  }
}
