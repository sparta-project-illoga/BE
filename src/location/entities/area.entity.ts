import { Post } from 'src/post/entities/post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';

@Entity({
  name: 'areas',
})
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  areaCode: number;

  @Column()
  name: string;

  @OneToMany(() => Post, (post) => post.area)
  posts: Post[];
}
