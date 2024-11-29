import { UserRepository } from '@/database/repositories';
import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from '@/api/dtos/profile.dto';
import { UserEntity } from '@/database/entities';
import { GetUserDto } from '@/api/dtos/user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  getProfileById = async (user_id: string) => {
    const user = await this.userRepository.findOneById(user_id, [
      'user.id',
      'user.avatar_url',
      'user.username',
      'user.email',
      'user.created_at',
    ]);
    return user;
  };

  updateProfile = async (user_id: string, data: UpdateProfileDto) => {
    const newUser = await this.userRepository
      .createQueryBuilder('user')
      .update(UserEntity)
      .set(data)
      .where(`user.id = :id`, { id: user_id })
      .returning([
        'user.id',
        'user.avatar_url',
        'user.username',
        'user.email',
        'user.created_at',
        'user.updated_at',
      ])
      .execute();
    return newUser;
  };

  getAllUsers = async (query: GetUserDto) => {
    const { items, meta } = await this.userRepository.paginate({
      ...query,
      selects: [
        'user.id',
        'user.avatar_url',
        'user.username',
        'user.email',
        'user.created_at',
      ],
    });
    return { items, meta };
  };
}
