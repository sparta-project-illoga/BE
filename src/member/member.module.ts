import { Global, Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { EventsModule } from 'src/events/events.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Plan, User]),
    PassportModule, EventsModule
  ],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService]
})
export class MemberModule { }