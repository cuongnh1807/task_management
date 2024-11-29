import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  HttpStatus,
  Query,
  Get,
  UseInterceptors,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TaskService } from '../services';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateTaskDto, GetTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import { HttpCacheInterceptor } from '../cache';

@Controller('tasks')
@ApiTags('Tasks')
@ApiBearerAuth()
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public async createTask(@Body() data: CreateTaskDto, @Request() req: any) {
    const result = await this.taskService.createTask(req.user.sub, data);
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(HttpCacheInterceptor)
  @ApiBearerAuth()
  public async getTasks(@Request() req: any, @Query() query: GetTaskDto) {
    const tasks = await this.taskService.getListTask({
      ...query,
      selects: [
        'task.id',
        'task.title',
        'task.description',
        'task.status',
        'task.priority',
        'task.code',
        'task.type',
      ],
    });
    return {
      statusCode: HttpStatus.OK,
      data: tasks,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getDetailTask(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const detail = await this.taskService.getDetailTask(id);
    return {
      statusCode: HttpStatus.OK,
      data: detail,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  public async updateTask(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() data: UpdateTaskDto,
  ) {
    const result = await this.taskService.updateTask(id, data);
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
}
