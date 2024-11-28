import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProjectEntity } from '../entities';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class ProjectRepository extends Repository<ProjectEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(ProjectEntity, dataSource.createEntityManager());
  }
}
