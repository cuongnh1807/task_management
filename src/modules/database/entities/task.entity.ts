import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { EPriority, ETaskStatus, ETaskType } from '@/shared/constants/enums';
import { UserEntity } from './user.entity';
import { ProjectEntity } from './project.entity';
import { CommentEntity } from './comment.entity';
import { NotificationEntity } from './notification.entity';

@Entity('tasks')
export class TaskEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: EPriority, nullable: true })
  priority: EPriority;

  @Column({ type: 'enum', enum: ETaskStatus, default: ETaskStatus.TODO })
  status: ETaskStatus;

  @Column({ type: 'enum', enum: ETaskType, default: ETaskType.TASK })
  type: ETaskType;

  @Column()
  code: string;

  @Column({
    nullable: true,
  })
  @Generated('increment')
  increment_id: number;

  @Column({ type: 'uuid', nullable: true })
  parent_task_id: string;

  @Column({ type: 'uuid' })
  project_id: string;

  @Column({ type: 'uuid', nullable: true })
  assignee_id: string;

  @Column({ type: 'uuid', nullable: true })
  reporter_id: string;

  @CreateDateColumn({ nullable: true })
  due_date: Date;

  @Column('text', { array: true, nullable: true })
  attachment_urls: string[];

  @ManyToOne(() => UserEntity, (entity) => entity.assigned_tasks)
  @JoinColumn({ name: 'assignee_id' })
  assignee: UserEntity;

  @ManyToOne(() => ProjectEntity, (e) => e.tasks)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @OneToOne(() => TaskEntity, (e) => e.parent_task)
  @JoinColumn({ name: 'parent_task_id' })
  parent_task: TaskEntity;

  @OneToMany(() => CommentEntity, (e) => e.task)
  @JoinColumn({ name: 'id' })
  comments: CommentEntity[];

  @OneToMany(() => NotificationEntity, (e) => e.task)
  @JoinColumn({ name: 'id' })
  notifications: NotificationEntity[];
}
