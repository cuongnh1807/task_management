import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TaskEntity } from './task.entity';

@Entity('projects')
export class ProjectEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  created_by: string;

  @OneToMany(() => TaskEntity, (e) => e.project)
  @JoinColumn({ name: 'id' })
  tasks: TaskEntity[];
}
