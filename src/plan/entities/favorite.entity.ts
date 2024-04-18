import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plan } from './plan.entity';

@Entity({
  name: 'favorites',
})
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorite)
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.favorite)
  plan: Plan;
}
