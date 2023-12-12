import { SearchService } from './search.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchCars(@Query('q') query: string) {
    if (!query) {
      return [];
    }
    return this.searchService.searchAutocomplete(query);
  }
}
