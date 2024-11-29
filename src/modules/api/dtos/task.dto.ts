import { EPriority, ETaskStatus, ETaskType } from '@/shared/constants/enums';
import { TransformArrayString } from '@/shared/decorators/transform-array-string.decorator';
import { PaginateDto } from '@/shared/pagination/paginate.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinDate,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Title of task',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'the id of project',
  })
  @IsUUID(4)
  project_id: string;

  @ApiPropertyOptional({
    example: 'Description of task',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://abc.png,https://xyz.png',
    type: [String],
    format: 'form',
  })
  @TransformArrayString()
  @IsString({ each: true })
  @IsOptional()
  attachment_urls?: string[];

  @ApiPropertyOptional({
    example: 'the id of assignee',
  })
  @IsOptional()
  @IsUUID(4)
  assignee_id?: string;

  @ApiProperty({
    example: ETaskType.STORY,
  })
  @IsEnum(ETaskType)
  type: ETaskType;

  @ApiProperty({
    example: EPriority.MEDIUM,
  })
  @IsEnum(EPriority)
  priority: EPriority;

  @ApiPropertyOptional({
    example: 'the parent task',
  })
  @IsOptional()
  @IsUUID(4)
  parent_task_id?: string;

  @ApiPropertyOptional({
    example: 'the due date',
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  due_date?: Date;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({
    example: 'Title of task',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'the id of project',
  })
  @IsUUID(4)
  @IsOptional()
  project_id?: string;

  @ApiPropertyOptional({
    example: 'Description of task',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://abc.png,https://xyz.png',
    type: [String],
    format: 'form',
  })
  @TransformArrayString()
  @IsString({ each: true })
  @IsOptional()
  attachment_urls?: string[];

  @ApiPropertyOptional({
    example: 'the id of assignee',
  })
  @IsOptional()
  @IsUUID(4)
  assignee_id?: string;

  @ApiPropertyOptional({
    example: ETaskType.STORY,
  })
  @IsOptional()
  @IsEnum(ETaskType)
  type?: ETaskType;

  @ApiPropertyOptional({
    example: EPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(EPriority)
  priority?: EPriority;

  @ApiPropertyOptional({
    example: 'the parent task',
  })
  @IsOptional()
  @IsUUID(4)
  parent_task_id?: string;

  @ApiPropertyOptional({
    example: 'the due date',
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  due_date?: Date;
}

export class GetTaskDto extends PaginateDto {
  @ApiPropertyOptional({
    example: 'asssignee1_id,asssignee2_id',
    type: [String],
    format: 'form',
  })
  @TransformArrayString()
  @IsUUID(4, { each: true })
  assignee_ids?: string[];

  @ApiPropertyOptional({
    example: 'reporter1_id,reporter2_id',
    type: [String],
    format: 'form',
  })
  @TransformArrayString()
  @IsUUID(4, { each: true })
  reporter_ids?: string[];

  @ApiPropertyOptional({
    example: 'project1_id,project2_id',
    type: [String],
    format: 'form',
  })
  @TransformArrayString()
  @IsUUID(4, { each: true })
  project_ids?: string[];

  @ApiPropertyOptional({
    example: `${ETaskType.STORY},${ETaskType.SUBTASK}`,
    type: [String],
    format: 'form',
  })
  @TransformArrayString()
  @IsEnum(ETaskType, { each: true })
  types?: ETaskType[];

  @ApiPropertyOptional({
    example: `${ETaskStatus.TODO},${ETaskStatus.IN_PROGRESS}`,
    type: [String],
    format: 'form',
  })
  @TransformArrayString()
  @IsEnum(ETaskStatus, { each: true })
  statuses?: ETaskStatus[];

  @ApiPropertyOptional({
    example: `${EPriority.LOW},${EPriority.LOWEST}`,
    type: [String],
    format: 'form',
  })
  @TransformArrayString()
  @IsEnum(EPriority, { each: true })
  priorities?: EPriority[];

  @ApiPropertyOptional({
    example: 'search text',
  })
  @IsOptional()
  @IsString()
  search_text?: string;
}
