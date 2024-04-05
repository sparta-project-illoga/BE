import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';
import { ServerToClientEvents } from './types/events';
import { ChatContent } from 'src/chat/entities/chat_contents.entity';
import { ChatRoom } from 'src/chat/entities/chat_rooms.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@WebSocketGateway({ namespace: 'events' })
export class EventsGateway {
  constructor(
    @InjectRepository(ChatContent)
    private readonly chatContentRepository: Repository<ChatContent>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
  ) { }

  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello World!';
  }

  createRoom(room: ChatRoom) {
    this.server.emit('newRoom', room);
  }

  sendMessage(message: ChatContent) {
    this.server.emit('newMessage', message);
  }
}
