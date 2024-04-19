import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { TourSpotTag } from './tour-spot-tag.entity';

@Entity({
  name: 'tour_spots',
})
export class TourSpot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  addr1: string;

  @Column({ nullable: true })
  @Index()
  addr2: string;

  @Column()
  @Index()
  areaCode: string;

  @Column()
  @Index()
  bookTour: string;

  @Column()
  @Index()
  cat1: string;

  @Column()
  @Index()
  cat2: string;

  @Column()
  @Index()
  cat3: string;

  @Column()
  @Index()
  contentId: string;

  @Column()
  @Index()
  contentTypeId: string;

  @Column()
  @Index()
  createdTime: string;

  @Column()
  @Index()
  firstImage: string;

  @Column()
  @Index()
  firstImage2: string;

  @Column()
  @Index()
  cpyrhtDivCd: string;

  @Column()
  @Index()
  mapX: string;

  @Column()
  @Index()
  mapY: string;

  @Column()
  @Index()
  mlevel: string;

  @Column()
  @Index()
  modifiedTime: string;

  @Column()
  @Index()
  sigunguCode: string;

  @Column()
  @Index()
  tel: string;

  @Column()
  @Index()
  title: string;

  @Column()
  @Index()
  zipCode: string;

  @OneToMany(() => TourSpotTag, (tourSpotTag) => tourSpotTag.tourSpot)
  tourSpotTags: TourSpotTag[];
}
