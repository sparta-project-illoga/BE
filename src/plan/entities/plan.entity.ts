import { IsNumber, IsString } from "class-validator";
import { Schedule } from "src/schedule/entities/schedule.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name : "plan"})
export class Plan {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({nullable: false})
    @IsString()
    name: string;

    @Column({nullable: false})
    @IsString()
    totallocalname: string;

    @Column({nullable: false})
    @IsNumber()
    totaldate: number;

    @Column({nullable: false})
    @IsNumber()
    totalmoney: number;

    @Column({nullable: true})
    @IsString()
    image: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Schedule, (schedule) => schedule.plan)
    schedule: Schedule[];
}
