import { ProjectRepository } from '@/database/repositories';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { CreateProjectDto } from '../dtos/project.dto';
import { Not } from 'typeorm';

@Injectable()
export class UpdateProjectValidatePipe implements PipeTransform<any> {
  constructor(
    @Inject('REQUEST')
    private request: any,
    private projectRepository: ProjectRepository,
  ) {}
  async transform(value: CreateProjectDto) {
    if (!Object.keys(value).length) {
      throw new BadRequestException('Nothing to change');
    }

    const id = this.request.params['id'];
    const existProject = await this.projectRepository.findOne({
      where: { id },
    });
    if (!existProject) {
      throw new NotFoundException('Notfound project');
    }

    if (existProject.created_by !== this.request.user.sub) {
      throw new BadRequestException('The project does not belong to you');
    }

    const existedNameProject = await this.projectRepository.findOne({
      where: {
        name: value.name,
        id: Not(id),
      },
    });
    if (existedNameProject) {
      throw new BadRequestException('The project name existed');
    }
    return value;
  }
}
