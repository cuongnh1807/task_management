import {
  NotificationRepository,
  TaskRepository,
} from '@/database/repositories';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from '@/api/dtos/task.dto';
import { TaskEntity } from '@/database/entities';
import {
  ENotificationMessage,
  ENotificationStatus,
  ETaskStatus,
} from '@/shared/constants/enums';
import { TaskFilter } from '@/shared/filters/task.filter';
import { RealtimeService } from '@/socket-gateway/services/realtime.service';

@Injectable()
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private notificationRepository: NotificationRepository,

    @Inject(RealtimeService)
    private realtimeService: RealtimeService,
  ) {}

  private formatTaskResponse(task: TaskEntity) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      code: task.increment_id,
      status: task.status,
      priority: task.priority,
      type: task.type,
      attachment_urls: task?.attachment_urls || null,
    };
  }

  async createTask(user_id: string, data: CreateTaskDto) {
    const newTask = await this.taskRepository.save({
      ...data,
      reporter_id: user_id,
      status: ETaskStatus.TODO,
    });

    // create notification to assignee
    try {
      await this.notificationRepository.save({
        user_id: data.assignee_id,
        task_id: newTask.id,
        status: ENotificationStatus.UNREAD,
        content: `You have a new task: ${newTask.title}`,
      });
      this.realtimeService.sendMessageBoardCast(
        `${ENotificationMessage.NEW_TASK}:${data.assignee_id}`,
        {
          content: `You have a new task: ${newTask.title}`,
          task_id: newTask.id,
        },
      );
    } catch (error) {
      console.log(error);
    }
    return this.formatTaskResponse(newTask);
  }

  async getDetailTask(id: string) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: {
        parent_task: true,
        project: true,
        assignee: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Notfound task');
    }
    return {
      ...this.formatTaskResponse(task),
      parent_task: task?.parent_task
        ? this.formatTaskResponse(task.parent_task)
        : null,
      project: {
        id: task?.project?.id,
        name: task?.project?.name,
      },
      assignee: task?.assignee
        ? {
            id: task?.assignee.id,
            username: task?.assignee?.username,
            avatar_url: task?.assignee?.avatar_url,
            email: task?.assignee?.email,
          }
        : null,
    };
  }

  async updateTask(id: string, data: UpdateTaskDto) {
    await this.taskRepository.update({ id }, data);
    return true;
  }

  async getListTask(filter: TaskFilter) {
    const { items, meta } = await this.taskRepository.paginate({
      ...filter,
    });
    return { items: items.map(this.formatTaskResponse), meta };
  }
}
