import { IsNumber, IsString } from "class-validator";
import { Plan } from "src/plan/entities/plan.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name : "schedule"})
export class Schedule {
    @PrimaryGeneratedColumn({type: "int"})
    id : number;

    @Column( {nullable: false} )
    planId: number;

    @Column({nullable: false})
    @IsString()
    place : string;

    @Column({nullable: false})
    @IsNumber()
    date: number;

    @Column({nullable: false})
    @IsNumber()
    money: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Plan, (plan) => plan.schedule)
    plan: Plan;

}