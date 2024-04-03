import { IsNumber, IsString } from "class-validator";
import { Schedule } from "src/schedule/entities/schedule.entity";
import { Place} from "../entities/place.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name : "plan"})
export class Plan {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({nullable: false})
    @IsString()
    name: string;

    @Column({nullable: false})
    totaldate: number;

    @Column({nullable: false})
    totalmoney: number;

    @Column({nullable: true})
    @IsString()
    image: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Schedule, (schedule) => schedule.plan, {onDelete: "CASCADE"})
    schedule: Schedule[];

    @OneToMany(() => Place, (place) => place.plan, {onDelete: "CASCADE"})
    place: Place[];
}