import { Module } from '@nestjs/common';
import { configDb } from './configs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CommentEntity,
  NotificationEntity,
  ProjectEntity,
  TaskEntity,
  UserEntity,
} from '@/database/entities';
import {
  CommentRepository,
  NotificationRepository,
  ProjectRepository,
  TaskRepository,
  UserRepository,
} from './repositories';
import { SeedDatabase } from './seeders/seed.database';

const repositories = [
  UserRepository,
  ProjectRepository,
  CommentRepository,
  NotificationRepository,
  TaskRepository,
];

const services = [];

const entities = [
  UserEntity,
  ProjectEntity,
  TaskEntity,
  CommentEntity,
  NotificationEntity,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('db'),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configDb],
    }),
  ],
  controllers: [],
  providers: [...repositories, ...services, SeedDatabase],
  exports: [...repositories, ...services],
})
export class DatabaseModule {}
