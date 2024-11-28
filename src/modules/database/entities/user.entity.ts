import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TaskEntity } from './task.entity';
import { CommentEntity } from './comment.entity';
import { NotificationEntity } from './notification.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  google_id: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  password: string;

  @OneToMany(() => TaskEntity, (e) => e.assignee)
  @JoinColumn({ name: 'id' })
  assigned_tasks: TaskEntity[];

  @OneToMany(() => CommentEntity, (e) => e.user)
  @JoinColumn({ name: 'id' })
  comments: CommentEntity[];

  @OneToMany(() => NotificationEntity, (e) => e.user)
  @JoinColumn({ name: 'id' })
  notifications: NotificationEntity[];
}
