import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Plan]),
    PassportModule,
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule { }