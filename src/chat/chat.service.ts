import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat_rooms.entity';
import { ChatContent } from './entities/chat_contents.entity';
import { EventsGateway } from 'src/events/events.gateway';
import { User } from 'src/user/entities/user.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import _ from 'lodash';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom) private readonly chatroomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatContent) private readonly chatcontentRepository: Repository<ChatContent>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,

    private eventGateway: EventsGateway
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

    this.eventGateway.createRoom(room);
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

    //message return 전에 gateway로 보내기
    this.eventGateway.sendMessage(message);
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
    return cArr;
  }
}