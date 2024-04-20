import { IsNumber, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Plan } from "./plan.entity";
import { Schedule } from "src/schedule/entities/schedule.entity";

@Entity({name: "place"})
export class Place {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column( {nullable: false} )
    planId: number;

    @Column()
    @IsString()
    placename: string

    @Column( {nullable : true})
    @IsNumber()
    areacode: number

    @ManyToOne(() => Plan, (plan) => plan.place, {onDelete: "CASCADE"})
    @JoinColumn({name: "planId"})
    plan: Plan;

    @OneToOne(() => Schedule)
    @JoinColumn({name: "ScheduleId"})
    schedule: Schedule
}