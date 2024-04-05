import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { MemberGuard } from './guards/member.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Plan, User]),
    PassportModule,
  ],
  controllers: [MemberController],
  providers: [MemberService, MemberGuard],
  exports: [MemberGuard],
})
export class MemberModule { }
