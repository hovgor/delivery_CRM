import { Injectable } from '@nestjs/common';
import { parse } from 'dotenv';
import { readFileSync } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Joi = require('joi');
export type EnvConfig = Record<string, string | number>;

export interface IConfig {
  NODE_ENV: string;
  HOST: string;
  PORT: number;
  GLOBAL_PREFIX: string;
  ALLOWED_ORIGINS: string[];
  SECRET: string;
  CHAT_TOKEN_SECRET: string;
  TOKEN_TIMEOUT: number;
  PUBLIC_FOLDER_PATH: string;
  WATERMARK: string;
  FRONT_URL: string;

  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  DATABASE_SCHEMA: string;

  JWT_SIGN_ALGORITHM: string;
  JWT_EXPIRE: string | number;
  JWT_REFRESH_EXPIRE: string | number;
  JWT_PUBLIC: string;
  JWT_PRIVATE: string;

  EMAIL_FROM: string;
  EMAIL_HOST: number;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;

  SENDGRID_API_KEY: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: IConfig;
  constructor(filePath: string) {
    if (process.env.NODE_ENV === 'dev') {
      const config = parse(readFileSync(filePath));
      this.envConfig = this.validateInput(config);
    } else {
      this.envConfig = this.validateInput(process.env);
    }
  }

  public get<K extends keyof IConfig>(key: K): IConfig[K] {
    return this.envConfig[key];
  }

  private validateInput(envConfig: EnvConfig): IConfig {
    const envVarsSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'demo', 'production')
        .default('development'),
      HOST: Joi.string().default('127.0.0.1'),
      PORT: Joi.number().default(3000),
      GLOBAL_PREFIX: Joi.string().default('api'),
      ALLOWED_ORIGINS: Joi.string().default('ggmp'),
      SECRET: Joi.string(),
      CHAT_TOKEN_SECRET: Joi.string(),
      TOKEN_TIMEOUT: Joi.number(),
      PUBLIC_FOLDER_PATH: Joi.string(),
      WATERMARK: Joi.string(),
      FRONT_URL: Joi.string(),

      DATABASE_HOST: Joi.string().default('localhost'),
      DATABASE_PORT: Joi.number().default(5432),
      DATABASE_USERNAME: Joi.string().default('delivary_user'),
      DATABASE_PASSWORD: Joi.string().allow('').default('asd123'),
      DATABASE_NAME: Joi.string().default('delivery'),
      DATABASE_SCHEMA: Joi.string().default('default'),

      JWT_SIGN_ALGORITHM: Joi.string().valid('RS256', 'HS256').default('HS256'),
      JWT_EXPIRE: Joi.string().default(315569260000),
      JWT_REFRESH_EXPIRE: Joi.string().default(315569260000),
      JWT_PUBLIC: Joi.string().default('X5eGIC6fGvevtnJb137jIexevUwjfK7F'),
      JWT_PRIVATE: Joi.string(),

      EMAIL_FROM: Joi.string(),
      EMAIL_HOST: Joi.number().default('smtp.sendgrid.net'),
      EMAIL_USER: Joi.string().default(''),
      EMAIL_PASSWORD: Joi.string().default(''),

      SENDGRID_API_KEY: Joi.string(),
    });
    const { error, value: validateEnvConfig } = envVarsSchema.validate(
      envConfig,
      {
        allowUnknown: true,
      },
    );

    // if (error) {
    //   throw new Error(`Config validation error: ${error.message}`);
    // }

    validateEnvConfig.ALLOWED_ORIGINS =
      validateEnvConfig.ALLOWED_ORIGINS.split(', ');
    return validateEnvConfig as IConfig;
  }
}
