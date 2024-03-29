import { Plan } from "src/plan/entities/plan.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChatRoom } from "./chat_rooms.entity";


@Entity({ name: 'contents', })
export class ChatContent {
    @PrimaryGeneratedColumn({ type: 'int' })
    contentId: number;

    @Column({ type: 'int', nullable: false })
    roomId: number;

    @Column({ type: 'text', nullable: false })
    chat: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => ChatRoom, (room) => room.content, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'roomId' })
    room: ChatRoom;
}
