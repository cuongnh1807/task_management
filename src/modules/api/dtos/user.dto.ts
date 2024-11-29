import { PaginateDto } from '@/shared/pagination/paginate.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetUserDto extends PaginateDto {
  @ApiPropertyOptional({
    example: 'search_text',
  })
  @IsOptional()
  @IsString()
  search_text: string;
}
