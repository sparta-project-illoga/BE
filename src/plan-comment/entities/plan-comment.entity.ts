import { Plan } from 'src/plan/entities/plan.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'plan_comments',
})
export class PlanComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'varchar', nullable: false})
  nickname:string;

  @Column({ type: 'int', nullable: false, unsigned: true })
  planId: number;

  @Column({ type: 'varchar', nullable: false, default: '' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.planComment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.planComment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  plan: Plan;
}
