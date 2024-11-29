import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { CommentEntity } from '../entities';
import { InjectDataSource } from '@nestjs/typeorm';
import { CommentFilter } from '@/shared/filters/comment.filter';
import { PaginationType, TCommentReponse } from '@/shared/types';

@Injectable()
export class CommentRepository extends Repository<CommentEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(CommentEntity, dataSource.createEntityManager());
  }

  queryFilter(
    query: SelectQueryBuilder<CommentEntity>,
    filter: CommentFilter,
  ): SelectQueryBuilder<CommentEntity> {
    if (filter?.task_ids?.length) {
      query.andWhere('comment.task_id IN (:...task_ids)', {
        ids: filter.task_ids,
      });
    }
    if (filter?.user_ids?.length) {
      query.andWhere('comment.user_id IN (:...user_ids)', {
        ids: filter.task_ids,
      });
    }
    if (filter?.sort_field && filter?.sort_type) {
      query.orderBy(filter?.sort_field, filter?.sort_type);
    }
    return query;
  }

  getQuery(filter: CommentFilter) {
    const query = this.createQueryBuilder('comment');
    return this.queryFilter(query, filter);
  }

  async paginate(
    filter?: CommentFilter,
  ): Promise<PaginationType<TCommentReponse>> {
    let query = this.createQueryBuilder('comment');
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
