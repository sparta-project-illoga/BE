import { Plan } from "src/plan/entities/plan.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChatContent } from "./chat_contents.entity";


@Entity({ name: 'rooms', })
export class ChatRoom {
    @PrimaryGeneratedColumn({ type: 'int' })
    roomId: number;

    @Column({ type: 'int', nullable: false })
    planId: number;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Plan, (plan) => plan.room, { onDelete: 'CASCADE' })
    plan: Plan;

    @OneToMany(() => ChatContent, (content) => content.room)
    content: ChatContent[];
}