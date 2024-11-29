import { PaginateDto } from '@/shared/pagination/paginate.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class CommentFilter extends PaginateDto {
  @IsUUID(4, { each: true })
  @IsOptional()
  task_ids?: string[];

  @IsUUID(4, { each: true })
  @IsOptional()
  user_ids?: string[];
}
