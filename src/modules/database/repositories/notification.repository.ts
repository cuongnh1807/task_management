import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NotificationEntity } from '../entities';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class NotificationRepository extends Repository<NotificationEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(NotificationEntity, dataSource.createEntityManager());
  }
}
