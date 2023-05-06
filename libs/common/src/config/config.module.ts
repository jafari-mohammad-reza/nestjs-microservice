import { Module } from '@nestjs/common';
import { ConfigModule as DotEnvModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';
@Module({
  imports: [DotEnvModule.forRoot({
    validationSchema: Joi.object({
      MONGO_URL: Joi.string().required(),
    })
  })],
  exports: [ConfigService],
  providers: [ConfigService]

})
export class ConfigModule { }
