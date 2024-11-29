import { PaginateDto } from '@/shared/pagination/paginate.dto';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ENotificationStatus } from '@/shared/constants/enums';

export class NotificationFilter extends PaginateDto {
  @IsUUID(4, { each: true })
  @IsOptional()
  ids?: string;

  @IsOptional()
  @IsUUID(4, { each: true })
  user_ids?: string[];

  @IsOptional()
  @IsUUID(4, { each: true })
  task_ids?: string[];

  @IsOptional()
  @IsEnum(ENotificationStatus, { each: true })
  statuses?: ENotificationStatus[];
}
