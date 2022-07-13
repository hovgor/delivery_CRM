import { ApiProperty } from '@nestjs/swagger';
import { PagedSearchDto } from '../../shared/search/paged-search.dto';

export class FilterSearchDto extends PagedSearchDto {
  @ApiProperty({ required: false })
  public beginning?: string;
}
