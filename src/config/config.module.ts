import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { DatabaseConfigService } from './database.config.service';
import { JWTConfigService } from './jwt.config.service';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useFactory: (): ConfigService => {
        return new ConfigService(`${process.cwd()}/.env`);
      },
    },
    DatabaseConfigService,
    JWTConfigService,
  ],
  exports: [ConfigService, DatabaseConfigService, JWTConfigService],
})
export class ConfigModule {}
