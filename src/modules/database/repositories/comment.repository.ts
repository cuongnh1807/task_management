import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CommentEntity } from '../entities';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class CommentRepository extends Repository<CommentEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(CommentEntity, dataSource.createEntityManager());
  }
}
