import { PaginateDto } from '@/shared/pagination/paginate.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class GetNotificationDto extends PaginateDto {
  @ApiPropertyOptional({
    example: 'The user_id',
  })
  @IsOptional()
  @IsUUID(4)
  user_id: string;
}
