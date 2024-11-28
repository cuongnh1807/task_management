import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TaskEntity } from '../entities';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class TaskRepository extends Repository<TaskEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(TaskEntity, dataSource.createEntityManager());
  }
}
