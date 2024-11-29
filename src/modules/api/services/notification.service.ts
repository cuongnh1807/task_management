import {
  NotificationRepository,
  TaskRepository,
} from '@/database/repositories';
import { NotificationFilter } from '@/shared/filters/notification.filter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private taskRepository: TaskRepository,
  ) {}

  async getListNotifications(filter: NotificationFilter) {
    const { items, meta } = await this.notificationRepository.paginate(filter);
    let taskIds = items.map((item) => item.task_id).filter((i) => !!i);
    taskIds = [...new Set(taskIds)];
    let tasks = {};
    if (taskIds?.length) {
      const taskQuery = this.taskRepository.getQuery({
        ids: taskIds,
        selects: ['task.id', 'task.title', 'task.description', 'task.code'],
      });

      const taskResult = await taskQuery.getRawMany();
      tasks = taskResult.reduce((acc, item) => {
        acc[item.id] = item;
      }, {});
    }
    return {
      items: items.map((item) => ({
        ...item,
        task: item.task_id ? tasks[item?.task_id] : null,
      })),
      meta,
    };
  }
}
