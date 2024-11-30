import { ProjectRepository } from '@/database/repositories';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from '@/api/dtos/project.dto';
import { TProjectReponse } from '@/shared/types';
import { ProjectEntity } from '@/database/entities';
import { ProjectFilter } from '@/shared/filters/project.filter';

@Injectable()
export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {}

  private _formatProjectReponse = (project: ProjectEntity | any) => {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      created_at: project.created_at,
      created_by: project.created_by,
    };
  };

  async createProject(
    user_id: string,
    data: CreateProjectDto,
  ): Promise<TProjectReponse> {
    const existedProject = await this.projectRepository.findOneBy({
      name: data.name,
    });
    if (existedProject) {
      throw new BadRequestException("The project'name existed");
    }
    const newProject = await this.projectRepository.save({
      ...data,
      created_by: user_id,
    });
    return this._formatProjectReponse(newProject);
  }

  async getDetailProject(id: string) {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException('Not found project');
    }
    return this._formatProjectReponse(project);
  }

  async updateProject(id: string, data: UpdateProjectDto) {
    const newProject = await this.projectRepository
      .createQueryBuilder()
      .update(ProjectEntity)
      .set(data)
      .where(`id = :id`, { id: id })
      .returning('*')
      .execute();

    return this._formatProjectReponse(newProject.raw[0]);
  }

  async getListProject(query: ProjectFilter) {
    const { items, meta } = await this.projectRepository.paginate({
      ...query,
    });
    return {
      items: items.map(this._formatProjectReponse),
      meta,
    };
  }
}
