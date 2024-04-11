import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TourSpot } from './tour-spot.entity';
import { Tag } from './tag.entity';

@Entity({
  name: 'tour_spot_tags',
})
export class TourSpotTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TourSpot, (tourSpot) => tourSpot.tourSpotTags)
  tourSpot: TourSpot;

  @ManyToOne(() => Tag, (tag) => tag.tourSpotTags)
  tag: Tag;
}
