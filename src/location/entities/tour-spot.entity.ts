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
  addr1: string;

  @Column({ nullable: true })
  addr2: string;

  @Column()
  areaCode: string;

  @Column()
  bookTour: string;

  @Column()
  cat1: string;

  @Column()
  cat2: string;

  @Column()
  cat3: string;

  @Column()
  contentId: string;

  @Column()
  contentTypeId: string;

  @Column()
  createdTime: string;

  @Column()
  firstImage: string;

  @Column()
  firstImage2: string;

  @Column()
  cpyrhtDivCd: string;

  @Column()
  mapX: string;

  @Column()
  mapY: string;

  @Column()
  mlevel: string;

  @Column()
  modifiedTime: string;

  @Column()
  sigunguCode: string;

  @Column()
  tel: string;

  @Column()
  @Index()
  title: string;

  @Column()
  zipCode: string;

  @OneToMany(() => TourSpotTag, (tourSpotTag) => tourSpotTag.tourSpot)
  tourSpotTags: TourSpotTag[];
}
