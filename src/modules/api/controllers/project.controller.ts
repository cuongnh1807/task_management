import {
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectService } from '../services';
import { JwtAuthGuard } from '@/api/guards/jwt-auth.guard';
import {
  CreateProjectDto,
  GetProjectDto,
  UpdateProjectDto,
} from '@/api/dtos/project.dto';
import { HttpCacheInterceptor } from '../cache';
import { UpdateProjectValidatePipe } from '@/api/validations';

@ApiTags('Project')
@Controller('projects')
@ApiBearerAuth()
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  public async createProject(
    @Request() req: any,
    @Body() data: CreateProjectDto,
  ) {
    const result = await this.projectService.createProject(req.user.sub, data);
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @Get(':id')
  @UseInterceptors(HttpCacheInterceptor)
  @UseGuards(JwtAuthGuard)
  public async getProjectDetail(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const result = await this.projectService.getDetailProject(id);
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  public async updateProject(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(UpdateProjectValidatePipe) data: UpdateProjectDto,
  ) {
    const result = await this.projectService.updateProject(id, data);
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @Get('')
  @UseInterceptors(HttpCacheInterceptor)
  @UseGuards(JwtAuthGuard)
  public async getProjects(@Request() req: any, @Query() query: GetProjectDto) {
    const result = await this.projectService.getListProject(query);
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
}
