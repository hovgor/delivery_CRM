import { ApiProperty } from '@nestjs/swagger';

export class PagedSearchDto {
  @ApiProperty()
  public limit: number;
  @ApiProperty()
  public offset: number;
}
