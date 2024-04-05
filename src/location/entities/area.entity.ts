import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'areas',
})
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  areaCode: string;

  @Column()
  name: string;
}
