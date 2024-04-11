import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'locations',
})
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;
  // 주소
  @Column({ type: 'varchar', name: 'address_name' })
  address_name;

  // 시/도
  @Column({ type: 'varchar', name: 'region_1depth_name' })
  region_1depth_name;

  // 구
  @Column({ type: 'varchar', name: 'region_2depth_name' })
  region_2depth_name;

  // 면
  @Column({ type: 'varchar', name: 'region_3depth_name' })
  region_3depth_name;

  // 위도
  @Column({ type: 'double' })
  latitude: number;

  // 경도
  @Column({ type: 'double' })
  longitude: number;

  @OneToOne(() => User, (user) => user.location, {
    onDelete: 'CASCADE',
  })
  user: User;
}
