import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat_rooms.entity';
import { ChatContent } from './entities/chat_contents.entity';
import { EventsGateway } from 'src/events/events.gateway';
import { User } from 'src/user/entities/user.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import _ from 'lodash';
import { Member } from 'src/member/entities/member.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom) private readonly chatroomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatContent) private readonly chatcontentRepository: Repository<ChatContent>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
    @InjectRepository(Member) private readonly memberRepository: Repository<Member>
  ) { }

  //채팅방 만들기
  async createRoom(planId: number, roomName: string) {
    const plan = await this.planRepository.findOneBy({ id: planId });
    const check = await this.chatroomRepository.findOneBy({ planId });

    if (!plan) {
      throw new NotFoundException('해당 플랜이 존재하지 않습니다.');
    };

    if (check) {
      throw new BadRequestException('이미 해당 채팅방이 존재합니다.');
    }

    await this.chatroomRepository.save({ planId, name: roomName });
    const room = await this.chatroomRepository.findOne({ where: { planId } });

    return room;
  }

  //채팅 입력
  async createMessage(roomId: number, userId: number, chat: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const room = await this.chatroomRepository.findOneBy({ roomId });

    if (!room) {
      throw new NotFoundException('해당 채팅방이 존재하지 않습니다.');
    }

    const message = await this.chatcontentRepository.save({ roomId, userId, chat })

    return { name: user.nickname, ...message };
  }

  //채팅 내용 조회
  async findAll(roomId: number) {

    const room = await this.chatroomRepository.findOneBy({ roomId });

    if (!room) {
      throw new NotFoundException('해당 채팅방이 존재하지 않습니다.');
    }

    const messages = await this.chatcontentRepository.find({
      where: { roomId },
    });

    let cArr = [];

    for (let i = 0; i < messages.length; i++) {
      const uId = messages[i].userId;
      const user = await this.userRepository.findOneBy({ id: uId });
      const chat = messages[i].chat;

      cArr.push({ name: user.nickname, chat: chat });
    }

    const chat = { "room": room, "content": cArr }
    return chat;
  }

  //유저가 속한 플랜과 채팅방 조회
  async getPlanNChat(userId: number) {
    const plans = await this.memberRepository.find({ where: { userId } });
    let planchat = [];

    for (let i = 0; i < plans.length; i++) {
      const plan = await this.planRepository.findOneBy({ id: plans[i].planId });
      const room = await this.chatroomRepository.findOneBy({ planId: plans[i].planId });
      if (!room) {
        console.log(`${plans[i].planId} 플랜의 채팅방이 존재하지 않습니다.`);
      }
      const pr = { "plan": plan, "room": room };
      planchat.push({ "PlanRoom": pr });
    }

    return planchat;
  }
}