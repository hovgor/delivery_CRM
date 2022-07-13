import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ConfigEnum } from './config.enum';
import { ConfigService } from './config.service';

@Injectable()
export class JWTConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  public createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    return {
      publicKey: this.configService.get(ConfigEnum.JWT_PUBLIC) || 'aaaa',
      privateKey: this.configService.get(ConfigEnum.JWT_PRIVATE) || 'aaaa',
      signOptions: {
        algorithm: 'HS256',
        expiresIn: this.configService.get(ConfigEnum.JWT_EXPIRE),
      },
    };
  }
  public get(key: 'public' | 'private'): string {
    try {
      return readFileSync(
        resolve(process.cwd(), 'keys', `${key}.pem`),
        'utf-8',
      );
    } catch (error) {
      console.log(error);
      return '';
    }
  }
}
