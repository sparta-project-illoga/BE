import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';
import { ServerToClientEvents } from './types/events';
import { ChatContent } from 'src/chat/entities/chat_contents.entity';
import { ChatRoom } from 'src/chat/entities/chat_rooms.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnModuleInit } from '@nestjs/common';
import { Member } from 'src/member/entities/member.entity';

@WebSocketGateway(3001, { namespace: 'events', cors: '*' })
export class EventsGateway implements OnModuleInit {
    constructor(
        @InjectRepository(ChatContent)
        private readonly chatContentRepository: Repository<ChatContent>,
        @InjectRepository(ChatRoom)
        private readonly chatRoomRepository: Repository<ChatRoom>,
    ) { }

    @WebSocketServer()
    server: Server<any, ServerToClientEvents>;

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            console.log('Connected');
            this.server.emit('connected');
        });
    }

    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): void {
        console.log("client : ", client);
        console.log("payload : ", payload);

        const responseMessage = payload;
        this.server.emit('responseMessage', responseMessage);
    }

    createRoom(room: ChatRoom) {
        console.log(`${room.name} 채팅방이 생성되었습니다.`)
        this.server.emit('newRoom', room);
    }

    sendMessage(message: ChatContent) {
        this.server.emit('newMessage', message);
    }

    addMember(member: Member) {
        this.server.emit('addMember', member);

    }
}

