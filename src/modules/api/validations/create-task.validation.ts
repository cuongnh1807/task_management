import { CreateTaskDto } from '@/api/dtos/task.dto';
import {
  ProjectRepository,
  TaskRepository,
  UserRepository,
} from '@/database/repositories';
import { ETaskType } from '@/shared/constants/enums';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CreateTaskValidationPipe implements PipeTransform<any> {
  constructor(
    private taskRepository: TaskRepository,
    private projectRepository: ProjectRepository,
    private userRepository: UserRepository,
  ) {}

  async transform(value: CreateTaskDto) {
    const project = await this.projectRepository.findOneBy({
      id: value.project_id,
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (value.type === ETaskType.SUBTASK || value.type === ETaskType.SUB_BUG) {
      if (!value.parent_task_id) {
        throw new BadRequestException();
      }
      const parentTask = await this.taskRepository.findOneBy({
        id: value.parent_task_id,
      });
      if (!parentTask) {
        throw new NotFoundException('Parent task not found');
      }
    }

    if (value.assignee_id) {
      const user = await this.userRepository.findOneBy({
        id: value.assignee_id,
      });
      if (!user) {
        throw new NotFoundException('Assignee not found');
      }
    }
    return value;
  }
}
