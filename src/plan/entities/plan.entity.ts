import { IsNumber, IsString } from "class-validator";
import { Schedule } from "src/schedule/entities/schedule.entity";
import { Place } from "../entities/place.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Member } from "src/member/entities/member.entity";
import { ChatRoom } from "src/chat/entities/chat_rooms.entity";
import { Category } from "src/category/entities/category.entity";

@Entity({ name: "plan" })
export class Plan {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ nullable: false })
    @IsString()
    name: string;

    @Column({ nullable: false })
    totaldate: number;

    @Column({ nullable: false })
    totalmoney: number;

    @Column({ nullable: true })
    @IsString()
    image: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Schedule, (schedule) => schedule.plan, { onDelete: "CASCADE" })
    schedule: Schedule[];

    @OneToMany(() => Place, (place) => place.plan, { onDelete: "CASCADE" })
    place: Place[];

    @OneToMany(() => Member, (member) => member.plan, { onDelete: "CASCADE" })
    member: Member[];

    //추가함!!
    @OneToOne(() => ChatRoom, (room) => room.plan)
    room: ChatRoom;

    @OneToMany(() => Category, (category) => category.plan)
    category: Category;
}
