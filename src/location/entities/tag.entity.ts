import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TourSpotTag } from './tour-spot-tag.entity';

@Entity({
  name: 'tags',
})
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  name: string;

  @OneToMany(() => TourSpotTag, (tourSpotTag) => tourSpotTag.tag)
  tourSpotTags: TourSpotTag[];
}
