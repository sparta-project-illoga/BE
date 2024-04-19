import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'check-points',
})
export class Checkpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lastProcessedTourSpotId: number;
}
