import { PaginateDto } from '@/shared/pagination/paginate.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'name of project',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'The description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class GetProjectDto extends PaginateDto {
  @ApiPropertyOptional({
    example: 'search_text',
  })
  @IsString()
  @IsOptional()
  search_text: string;
}

export class UpdateProjectDto {
  @ApiPropertyOptional({
    example: 'name of project',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'The description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
