import { PaginateDto } from '@/shared/pagination/paginate.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ProjectFilter extends PaginateDto {
  @IsOptional()
  @IsUUID(4, { each: true })
  ids?: string;

  @IsOptional()
  @IsString()
  search_text?: string;

  @IsOptional()
  @IsUUID(4, { each: true })
  user_ids?: string[];

  @IsOptional()
  @IsString({ each: true })
  selects?: string[];
}
