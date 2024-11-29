import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginateDto } from '@/shared/pagination/paginate.dto';
import { EPriority, ETaskStatus, ETaskType } from '@/shared/constants/enums';

export class TaskFilter extends PaginateDto {
  @IsOptional()
  @IsUUID(4, { each: true })
  ids?: string[];

  @IsOptional()
  @IsUUID(4, { each: true })
  project_ids?: string[];

  @IsOptional()
  @IsUUID(4, { each: true })
  assignee_ids?: string[];

  @IsOptional()
  @IsUUID(4, { each: true })
  reporter_ids?: string[];

  @IsOptional()
  @IsString()
  search_text?: string;

  @IsOptional()
  @IsEnum(ETaskStatus, { each: true })
  statuses?: ETaskStatus[];

  @IsOptional()
  @IsEnum(ETaskType, { each: true })
  types?: ETaskType[];

  @IsOptional()
  @IsEnum(EPriority, { each: true })
  priorities?: EPriority[];

  @IsOptional()
  @IsString({ each: true })
  selects?: string[];
}
