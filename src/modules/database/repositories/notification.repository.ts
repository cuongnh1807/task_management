import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { NotificationEntity } from '../entities';
import { InjectDataSource } from '@nestjs/typeorm';
import { NotificationFilter } from '@/shared/filters/notification.filter';
import { PaginationType, TNotificationReponse } from '@/shared/types';

@Injectable()
export class NotificationRepository extends Repository<NotificationEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(NotificationEntity, dataSource.createEntityManager());
  }

  queryFilter(
    query: SelectQueryBuilder<NotificationEntity>,
    filter: NotificationFilter,
  ): SelectQueryBuilder<NotificationEntity> {
    if (filter?.ids?.length) {
      query.andWhere('notification.id IN (:...ids)', { ids: filter.ids });
    }
    if (filter?.statuses?.length) {
      query.andWhere('notification.status IN (:...statuses)', {
        statuses: filter.statuses,
      });
    }
    if (filter?.user_ids?.length) {
      query.andWhere('notification.user_id IN (:...user_ids)', {
        user_ids: filter.user_ids,
      });
    }
    if (filter?.task_ids?.length) {
      query.andWhere('notification.task_id IN (:...task_ids)', {
        task_ids: filter.task_ids,
      });
    }
    if (filter?.sort_field && filter?.sort_type) {
      query.orderBy(filter?.sort_field, filter?.sort_type);
    }
    return query;
  }

  getQuery(filter: NotificationFilter) {
    const query = this.createQueryBuilder('notification');
    return this.queryFilter(query, filter);
  }

  async paginate(
    filter?: NotificationFilter,
  ): Promise<PaginationType<TNotificationReponse>> {
    let query = this.createQueryBuilder('notification');
    query = this.queryFilter(query, filter);
    const page = filter.page ? filter.page : 1;
    const perPage = filter.take ? filter.take : 20;
    query.limit(perPage).offset((page - 1) * perPage);
    const [entities, total] = await query.getManyAndCount();
    return {
      items: entities,
      meta: {
        total: total,
        current_page: page,
        total_pages: Math.ceil(total / perPage),
        per_page: perPage,
      },
    };
  }
}
