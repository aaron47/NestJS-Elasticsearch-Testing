import { Module } from '@nestjs/common';
import { SearchModule } from './search/search.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        ELASTICSEARCH_NODE: Joi.string().required(),
        ELASTIC_USERNAME: Joi.string().required(),
        ELASTIC_PASSWORD: Joi.string().required(),
        ELASTIC_CERTIFICATE_PATH: Joi.string().required(),
      }),
    }),
    SearchModule,
  ],
})
export class AppModule {}
