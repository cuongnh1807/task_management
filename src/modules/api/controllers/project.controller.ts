import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectService } from '../services';

@ApiTags('Project')
@Controller('projects')
@ApiBearerAuth()
export class ProjectController {
  constructor(private projectService: ProjectService) {}
}
