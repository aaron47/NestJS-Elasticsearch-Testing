import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  async searchAutocomplete(query: string): Promise<string[]> {
    const tokens = query.toLowerCase().split(' ');
    const clauses = tokens.map((token) => ({
      span_multi: {
        match: {
          fuzzy: {
            name: {
              value: token,
              fuzziness: 'AUTO',
            },
          },
        },
      },
    }));

    const payload = {
      bool: {
        must: {
          span_near: {
            clauses: clauses,
            slop: 0,
            in_order: false,
          },
        },
      },
    };

    const MAX_SIZE = 15;

    try {
      const response = await this.esService.search({
        index: 'cars',
        body: { query: payload },
        size: MAX_SIZE,
      });

      return response.hits.hits.map((hit) => (hit._source as any).name);
    } catch (error) {
      throw error;
    }
  }
}
