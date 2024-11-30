import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ApiModule } from '@/api/api.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import {
  CommentEntity,
  NotificationEntity,
  ProjectEntity,
  TaskEntity,
  UserEntity,
} from '@/database/entities';
import { getHash } from '@/shared/utils';
import path from 'path';
import { TestUtils } from './test-utils';

const testEnvPath = path.resolve(__dirname, '../.env.test');
dotenv.config({ path: testEnvPath });
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const entities = [
    UserEntity,
    ProjectEntity,
    TaskEntity,
    CommentEntity,
    NotificationEntity,
  ];

  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.TEST_DB_HOST,
          port: parseInt(process.env.TEST_DB_PORT),
          username: process.env.TEST_DB_USERNAME,
          password: process.env.TEST_DB_PASSWORD,
          database: process.env.TEST_DB_DATABASE,
          entities,
          synchronize: true,
        }),
        ApiModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    dataSource = new DataSource({
      type: 'postgres',
      host: process.env.TEST_DB_HOST,
      port: parseInt(process.env.TEST_DB_PORT),
      username: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_DATABASE,
      entities,
      synchronize: true,
    });
    await dataSource.initialize();
    await app.init();
  });

  afterAll(async () => {
    await moduleFixture.close();
    await app.close();
  });

  describe('POST /auth/sign-up', () => {
    it('should create a new user and return access token', async () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'Password@123',
        username: 'testuser',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpDto)
        .expect(201);

      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.email).toBe(signUpDto.email);
      expect(response.body.data.username).toBe(signUpDto.username);
    });

    it('should fail when email already exists', async () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'Password@123',
        username: 'testuser',
      };

      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpDto)
        .expect(400);
    });

    afterAll(async () => {
      await TestUtils.cleanDatabase(dataSource);
    });
  });

  describe('POST /auth/sign-in', () => {
    const password = 'Password@123';
    const user = {
      email: 'abc@example.com',
      password: getHash(password),
    };

    it('should authenticate user and return access token', async () => {
      await dataSource.manager
        .getRepository(UserEntity)
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values(user)
        .returning('*')
        .execute();
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: user.email,
          password: password,
        })
        .expect(201);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.email).toBe(user.email);
    });

    it('should fail with incorrect password', async () => {
      const user = {
        email: 'test@example.com',
        password: 'Password@123222',
        username: 'testuser',
      };

      await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(400);
    });

    afterAll(async () => {
      await TestUtils.cleanDatabase(dataSource);
    });
  });
});
