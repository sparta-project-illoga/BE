import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { EventsModule } from 'src/events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ChatRoom } from './entities/chat_rooms.entity';
import { ChatContent } from './entities/chat_contents.entity';
import { User } from 'src/user/entities/user.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { MemberGuard } from 'src/member/guards/member.guard';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, ChatContent, User, Plan]),
    PassportModule, EventsModule, MemberModule
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule { }
