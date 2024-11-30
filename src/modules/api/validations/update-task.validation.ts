import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { UpdateTaskDto } from '@/api/dtos/task.dto';
import { ProjectRepository, TaskRepository } from '@/database/repositories';

@Injectable()
export class UpdateTaskValidationPipe implements PipeTransform<any> {
  constructor(
    private taskRepository: TaskRepository,
    private projectRepository: ProjectRepository,
    @Inject('REQUEST')
    private req: any,
  ) {}

  async transform(value: UpdateTaskDto) {
    if (!Object.keys(value).length) {
      throw new BadRequestException('Nothing to change');
    }
    const task = await this.taskRepository.findOneBy({
      id: this.req.params.id,
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (value.project_id && task.project_id !== value.project_id) {
      const project = await this.projectRepository.findOneBy({
        id: value.project_id,
      });
      if (!project) {
        throw new NotFoundException('Project not found');
      }
    }
    if (value.assignee_id && task.assignee_id !== value.assignee_id) {
      const user = await this.projectRepository.findOneBy({
        id: value.assignee_id,
      });
      if (!user) {
        throw new NotFoundException('Assignee not found');
      }
    }
    return value;
  }
}
