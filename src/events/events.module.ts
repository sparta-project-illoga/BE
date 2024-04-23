import { Module, forwardRef } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatContent } from 'src/chat/entities/chat_contents.entity';
import { ChatRoom } from 'src/chat/entities/chat_rooms.entity';
import { Member } from 'src/member/entities/member.entity';
import { User } from 'src/user/entities/user.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { ChatService } from 'src/chat/chat.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChatRoom, ChatContent, Member, User, Plan]),
        // forwardRef(() => ChatModule)
        ChatModule
    ],
    providers: [EventsGateway],
    exports: [EventsGateway],
})
export class EventsModule { }