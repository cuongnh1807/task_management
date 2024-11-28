import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';

@Entity('comments')
export class CommentEntity extends BaseEntity {
  @Column({ nullable: true })
  content: string;

  @Column({ type: 'uuid' })
  task_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => TaskEntity, (e) => e.comments)
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;

  @ManyToOne(() => UserEntity, (e) => e.comments)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column('text', { array: true, nullable: true })
  attachment_urls: string[];
}
