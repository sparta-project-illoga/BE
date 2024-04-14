import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChatRoom } from "./chat_rooms.entity";
import { User } from "src/user/entities/user.entity";


@Entity({ name: 'contents' })
export class ChatContent {
    @PrimaryGeneratedColumn({ type: 'int' })
    contentId: number;

    @Column({ type: 'int', nullable: false })
    roomId: number;

    //사용자 추가
    @Column()
    userId: number;

    @Column({ type: 'text', nullable: false })
    chat: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => ChatRoom, (room) => room.content, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'roomId' })
    room: ChatRoom;

    @ManyToOne(() => User, (user) => user.content, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}