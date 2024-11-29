import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { ProjectEntity } from '../entities';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProjectFilter } from '@/shared/filters/project.filter';
import { PaginationType, TProjectReponse } from '@/shared/types';

@Injectable()
export class ProjectRepository extends Repository<ProjectEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(ProjectEntity, dataSource.createEntityManager());
  }

  queryFilter(
    query: SelectQueryBuilder<ProjectEntity>,
    filter: ProjectFilter,
  ): SelectQueryBuilder<ProjectEntity> {
    if (filter?.ids?.length) {
      query.andWhere('project.id IN (:...ids)', { ids: filter.ids });
    }

    if (filter?.user_ids?.length) {
      query.andWhere('project.created_by IN (:...user_ids)', {
        user_ids: filter.user_ids,
      });
    }

    if (filter?.search_text) {
      query.andWhere(
        new Brackets((qb) =>
          qb.where(
            'project.name ilike :search_text OR project.description ilike :search_text',
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

  async paginate(
    filter?: ProjectFilter,
  ): Promise<PaginationType<TProjectReponse>> {
    let query = this.createQueryBuilder('project');
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
