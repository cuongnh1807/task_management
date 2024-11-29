import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserEntity } from '@/database/entities';
import { UserFilter } from '@/shared/filters/user.filter';
import { PaginationType, TUserReponse } from '@/shared/types';

export class UserRepository extends Repository<UserEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }
  async findOneById(
    id: string,
    selects: string[] = [],
    relations: string[] = [],
  ): Promise<UserEntity> {
    let query = this.createQueryBuilder('user').where('user.id = :id', {
      id,
    });

    for (const relation of relations) {
      query = query.leftJoinAndSelect(`user.${relation}`, relation);
    }
    if (selects && selects.length) {
      query.select(selects);
    }
    return query.limit(1).getOne();
  }

  queryFilter(
    query: SelectQueryBuilder<UserEntity>,
    filter: UserFilter,
  ): SelectQueryBuilder<UserEntity> {
    if (filter?.ids?.length) {
      query.andWhere('user.id IN (:...ids)', { ids: filter.ids });
    }

    if (filter?.emails?.length) {
      query.andWhere('user.email IN (:...emails)', { emails: filter.emails });
    }

    if (filter?.usernames?.length) {
      query.andWhere('user.username IN (:...usernames)', {
        usernames: filter.usernames,
      });
    }
    if (filter?.search_text) {
      query.andWhere(
        new Brackets((qb) =>
          qb.where(
            'user.username ilike :search_text OR user.email ilike :search_text',
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

  getQuery(filter: UserFilter) {
    const query = this.createQueryBuilder('user');
    return this.queryFilter(query, filter);
  }

  async paginate(filter?: UserFilter): Promise<PaginationType<TUserReponse>> {
    let query = this.createQueryBuilder('user');
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
