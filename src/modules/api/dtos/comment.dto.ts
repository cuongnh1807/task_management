import { TransformArrayString } from '@/shared/decorators/transform-array-string.decorator';
import { PaginateDto } from '@/shared/pagination/paginate.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'The content of comment',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: 'The id of task',
  })
  @IsUUID(4)
  task_id: string;

  @ApiPropertyOptional({
    example: 'https://a.uxg,https://b.mng',
    type: [String],
    format: 'form',
  })
  @TransformArrayString()
  @IsString({ each: true })
  @IsOptional()
  attachment_urls?: string[];
}

export class GetCommentDto extends PaginateDto { }

export class UpdateCommentDto {
  @ApiPropertyOptional({
    example: 'The content of comment',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: 'https://a.uxg,https://b.mng',
    type: [String],
    format: 'form',
  })
  @TransformArrayString()
  @IsString({ each: true })
  @IsOptional()
  attachment_urls?: string[];
}
