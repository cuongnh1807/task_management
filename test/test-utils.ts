import { UserEntity } from '@/database/entities';
import { DataSource } from 'typeorm';
import { getHash } from '@/shared/utils';

export class TestUtils {
  static async createTestUser(
    dataSource: DataSource,
    userData: Partial<UserEntity> = {},
  ) {
    const defaultUser = {
      email: 'test@example.com',
      password: getHash('Password123!'),
      username: 'testuser',
      ...userData,
    };

    return await dataSource
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values(defaultUser)
      .execute();
  }

  static async cleanDatabase(dataSource: DataSource) {
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      console.log(entity.tableName);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }
  }
}
