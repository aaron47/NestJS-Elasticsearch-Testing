import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        maxRetries: 10,
        requestTimeout: 60000,
        auth: {
          username: configService.get('ELASTIC_USERNAME'),
          password: configService.get('ELASTIC_PASSWORD'),
        },
        tls: {
          ca: fs.readFileSync(configService.get('ELASTIC_CERTIFICATE_PATH')),
          rejectUnauthorized: false,
        },
      }),
    }),
  ],
  providers: [SearchService],
  controllers: [SearchController],
  exports: [ElasticsearchModule],
})
export class SearchModule {}
