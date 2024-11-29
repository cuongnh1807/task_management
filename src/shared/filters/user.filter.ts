import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginateDto } from '../pagination/paginate.dto';

export class UserFilter extends PaginateDto {
  @IsUUID(4, { each: true })
  @IsOptional()
  ids?: string;

  @IsOptional()
  @IsString()
  search_text?: string;

  @IsOptional()
  @IsString({ each: true })
  usernames?: string[];

  @IsOptional()
  @IsString({ each: true })
  emails?: string[];

  @IsOptional()
  @IsString({ each: true })
  selects?: string[];
}
