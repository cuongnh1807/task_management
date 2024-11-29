import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { TaskEntity } from '../entities';
import { InjectDataSource } from '@nestjs/typeorm';
import { TaskFilter } from '@/shared/filters/task.filter';
import { PaginationType, TTaskReponse } from '@/shared/types';

@Injectable()
export class TaskRepository extends Repository<TaskEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(TaskEntity, dataSource.createEntityManager());
  }

  queryFilter(
    query: SelectQueryBuilder<TaskEntity>,
    filter: TaskFilter,
  ): SelectQueryBuilder<TaskEntity> {
    if (filter?.ids?.length) {
      query.andWhere('task.id IN (:...ids)', { ids: filter.ids });
    }
    if (filter?.assignee_ids?.length) {
      query.andWhere('task.assignee_id IN (:...assignee_ids)', {
        assignee_ids: filter?.assignee_ids,
      });
    }
    if (filter?.project_ids?.length) {
      query.andWhere('task.project_id IN (:...project_ids)', {
        project_ids: filter?.project_ids,
      });
    }
    if (filter?.statuses?.length) {
      query.andWhere('task.status IN (:...statuses)', {
        statuses: filter?.statuses,
      });
    }
    if (filter?.types?.length) {
      query.andWhere('task.type IN (:...types)', {
        types: filter?.types,
      });
    }
    if (filter?.priorities?.length) {
      query.andWhere('task.priority IN (:...priorities)', {
        priorities: filter?.priorities,
      });
    }
    if (filter?.search_text) {
      query.andWhere(
        new Brackets((qb) =>
          qb.where(
            'task.title ilike :search_text OR task.description ilike :search_text',
            { search_text: `%${filter.search_text}%` },
          ),
        ),
      );
    }
    if (filter?.sort_field && filter?.sort_type) {
      query.orderBy(filter?.sort_field, filter?.sort_type);
    }
    if (filter?.selects?.length) {
      query.select(filter.selects);
    }
    return query;
  }
  getQuery(filter: TaskFilter) {
    const query = this.createQueryBuilder('task');
    return this.queryFilter(query, filter);
  }

  async paginate(filter?: TaskFilter): Promise<PaginationType<TTaskReponse>> {
    let query = this.createQueryBuilder('task');
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
