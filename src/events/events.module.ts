import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatContent } from 'src/chat/entities/chat_contents.entity';
import { ChatRoom } from 'src/chat/entities/chat_rooms.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatRoom, ChatContent])
    ],
    providers: [EventsGateway],
    exports: [EventsGateway],
})
export class EventsModule { }