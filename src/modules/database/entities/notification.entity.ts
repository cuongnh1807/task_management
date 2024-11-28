import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ENotificationStatus } from '@/shared/constants/enums';
import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @Column()
  content: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid', nullable: true })
  task_id: string;

  @ManyToOne(() => TaskEntity, (e) => e.notifications)
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;

  @ManyToOne(() => UserEntity, (e) => e.notifications)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: ENotificationStatus,
    default: ENotificationStatus.UNREAD,
  })
  status: ENotificationStatus;
}
