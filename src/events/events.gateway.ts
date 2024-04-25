import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { ServerToClientEvents } from './types/events';
import { ChatContent } from 'src/chat/entities/chat_contents.entity';
import { ChatRoom } from 'src/chat/entities/chat_rooms.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { Member } from 'src/member/entities/member.entity';
import { AuthGuard } from '@nestjs/passport';
import { MemberGuard } from 'src/utils/member.guard';
import { ChatService } from 'src/chat/chat.service';
import { User } from 'src/user/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

interface CustomSocket extends Socket {
  authorization?: string;
  userId?: number;
  roomId?: number;
}

@WebSocketGateway({
  namespace: 'events',
  cors: { origin: `${process.env.BACK_TO_FRONT_API}`, credentials: true },
})
export class EventsGateway implements OnModuleInit {
  constructor(
    private readonly chatService: ChatService,
    @InjectRepository(ChatContent)
    private readonly chatContentRepository: Repository<ChatContent>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @WebSocketServer()
  server: Server<CustomSocket, ServerToClientEvents>;

  // 각 룸의 멤버 리스트를 저장할 객체
  private roomMembers: Record<number, Set<number>> = {};

  onModuleInit() {
    this.server.on('connection', (socket: CustomSocket) => {
      const authorization = socket.handshake.headers['authorization'] as string; // 'Authorization' 헤더
      console.log('Authorization:', authorization);

      // 다른 곳에서 사용할 수 있도록 저장
      socket.authorization = authorization;

      if (!authorization) {
        // 권한 부여 헤더가 없을 때 처리
        console.log('No Authorization header');
        socket.disconnect();
        return;
      }

      try {
        // JWT 토큰을 검증
        const token = authorization.replace('Bearer ', '');
        const decoded = jwt.verify(
          token,
          process.env.JWT_ACCESS_TOKEN_SECRET,
        ) as { [key: string]: any }; // JWT 시크릿 키

        console.log('decoded : ', decoded);
        //토큰에서 유저id 추출(sub로 저장)
        const userId = parseInt(decoded['sub'], 10);
        console.log('User ID:', userId);

        if (isNaN(userId)) {
          console.log('Invalid userId');
          socket.disconnect();
          return;
        }

        // 사용자 ID를 소켓에 연결
        socket.userId = userId;

        console.log('Socket ID:', socket.id);
        console.log('Connected');

        this.server.emit('connected');
      } catch (error) {
        console.log('Invalid JWT:', error);
        socket.disconnect(); // 토큰이 유효하지 않을 경우 소켓 연결 끊기
      }
    });
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: CustomSocket,
    payload: { roomId: number; chat: string },
  ) {
    console.log('client userId:', client.userId);
    console.log('authorization:', client.authorization);

    // roomId를 소켓에 저장
    client.roomId = payload.roomId;

    console.log('현재 roomId :', client.roomId);

    const chat = await this.chatService.createMessage(
      payload.roomId,
      client.userId,
      payload.chat,
    );
    const user = await this.userRepository.findOneBy({ id: client.userId });

    const responseMessage = { name: user.nickname, chat: payload.chat };

    // 특정 방에만 메시지 전송
    this.server
      .to(`room-${payload.roomId}`)
      .emit('responseMessage', responseMessage);
  }

  //채팅방 입장
  //해당 플랜/채팅방에 초대된 멤버인지 검증 후 추가
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: CustomSocket, payload: { roomId: number }) {
    const roomId = payload.roomId;

    const plan = await this.chatRoomRepository.findOneBy({ roomId });

    console.log('joinRoom 해당 플랜 찾음 : ', plan);
    console.log('joinRoom planId : ', plan.planId);

    // 방에 참여할 수 있는지 확인
    const member = await this.memberRepository.findOne({
      where: { userId: client.userId, planId: plan.planId },
    });

    console.log('joinRoom member : ', member);

    if (member) {
      client.join(`room-${roomId}`); // 클라이언트를 해당 방에 추가

      // 룸 멤버 객체에 룸 ID에 대한 Set이 없으면 생성
      if (!this.roomMembers[roomId]) {
        this.roomMembers[roomId] = new Set();
      }

      // 멤버 리스트에 현재 userId 추가
      this.roomMembers[roomId].add(client.userId);

      // 멤버 리스트를 배열로 변환하여 `joinRoomSuccess` 이벤트로 전달
      client.emit('joinRoomSuccess', Array.from(this.roomMembers[roomId]));

      console.log(`UserId : ${client.userId} ,roomId : ${roomId} 들어옴`);
      this.server
        .to(`room-${roomId}`)
        .emit('memberJoined', { userId: client.userId });
    } else {
      console.log(
        `UserId : ${client.userId}가 roomId : ${roomId}에 초대되어 있지 않습니다.`,
      );
      client.emit('joinRoomFailed', {
        message: '해당 채팅방에 초대된 멤버가 아닙니다.',
      });
    }
  }

  //타이핑 중인 사용자 정보 알려줌
  @SubscribeMessage('typing')
  async typing(
    client: CustomSocket,
    payload: { roomId: number; isTyping: boolean },
  ) {
    console.log('client userId:', client.userId);

    const user = await this.userRepository.findOneBy({ id: client.userId });
    // 특정 방에만 메시지 전송
    if (user) {
      this.server.to(`room-${payload.roomId}`).emit('typing', {
        nickname: user.nickname,
        isTyping: payload.isTyping,
      });
    }
  }
}
