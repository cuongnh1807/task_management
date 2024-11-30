import {
  NotificationRepository,
  UserRepository,
} from '@/database/repositories';
import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from '@/api/dtos/profile.dto';
import { NotificationEntity, UserEntity } from '@/database/entities';
import { GetUserDto } from '@/api/dtos/user.dto';
import { ENotificationStatus } from '@/shared/constants/enums';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private notificationRepository: NotificationRepository,
  ) {}

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
      .createQueryBuilder()
      .update(UserEntity)
      .set(data)
      .where(`id = :id`, { id: user_id })
      .returning([
        'id',
        'avatar_url',
        'username',
        'email',
        'created_at',
        'updated_at',
      ])
      .execute();
    return newUser.raw[0];
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

  async countUnreadNotification(user_id: string) {
    const query = this.notificationRepository.getQuery({
      user_ids: [user_id],
      statuses: [ENotificationStatus.UNREAD],
    });
    const result = await query.getCount();
    return result;
  }

  async markReadAllNotification(user_id: string) {
    await this.notificationRepository
      .createQueryBuilder('notification')
      .update(NotificationEntity)
      .set({ status: ENotificationStatus.READ })
      .where('notification.user_id = :user_id', { user_id })
      .andWhere('notification.status = :status', {
        status: ENotificationStatus.UNREAD,
      })
      .execute();
    return true;
  }
}
