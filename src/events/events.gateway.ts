import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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

// 환경 변수 로드
dotenv.config();

// 소켓 타입 확장
interface CustomSocket extends Socket {
    authorization?: string;
    userId?: number;
    roomId?: number;
}

// @UseGuards(MemberGuard)
@WebSocketGateway({ namespace: 'events', cors: { origin: 'http://localhost:3001', credentials: true } })
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
    ) { }

    @WebSocketServer()
    server: Server<CustomSocket, ServerToClientEvents>;

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
                const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET) as { [key: string]: any };; // JWT 시크릿 키


                console.log("decoded : ", decoded);
                const userId = parseInt(decoded['sub'], 10);
                // 토큰에서 유저 정보 추출
                // const userId = decoded['sub']; // 예: 토큰에 userId가 있음
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

    //@UseGuards(AuthGuard('jwt'))
    //@UseGuards(MemberGuard)
    @SubscribeMessage('message')
    async handleMessage(client: CustomSocket, payload: { roomId: number, chat: string }) {

        console.log("client userId:", client.userId);
        console.log("authorization:", client.authorization);

        // roomId를 소켓에 저장
        client.roomId = payload.roomId;

        console.log("현재 roomId :", client.roomId);

        const chat = await this.chatService.createMessage(payload.roomId, client.userId, payload.chat);
        const user = await this.userRepository.findOneBy({ id: client.userId });

        const responseMessage = { "name": user.nickname, "chat": payload.chat };

        // 특정 방에만 메시지 전송
        this.server.to(`room-${payload.roomId}`).emit('responseMessage', responseMessage);
    }

    //채팅방 입장
    //해당 플랜/채팅방에 초대된 멤버인지 검증 후 추가
    @SubscribeMessage('joinRoom')
    async handleJoinRoom(client: CustomSocket, payload: { roomId: number }) {
        const roomId = payload.roomId;

        console.log("joinRoom payload : ", payload);
        console.log("joinRoom roomId : ", roomId);

        const plan = await this.chatRoomRepository.findOneBy({ roomId });

        console.log("joinRoom 해당 플랜 찾음 : ", plan);
        console.log("joinRoom planId : ", plan.planId);

        // 방에 참여할 수 있는지 확인
        const member = await this.memberRepository.findOne({
            where: { userId: client.userId, planId: plan.planId },
        });

        console.log("joinRoom member : ", member);

        if (member) {
            client.join(`room-${roomId}`); // 클라이언트를 해당 방에 추가
            client.emit('joinRoomSuccess');
            console.log(`UserId : ${client.userId} ,roomId : ${roomId} 들어옴`);
            this.server.to(`room-${roomId}`).emit('memberJoined', { userId: client.userId });
        } else {
            console.log(`UserId : ${client.userId}가 roomId : ${roomId}에 초대되어 있지 않습니다.`);
            client.emit('joinRoomFailed', { message: '해당 채팅방에 초대된 멤버가 아닙니다.' });
        }
    }

    createRoom(room: ChatRoom) {
        console.log(`${room.name} 채팅방이 생성되었습니다.`)
        this.server.emit('newRoom', room);
    }

    sendMessage(message: ChatContent) {
        this.server.emit('newMessage', message);
    }

    addMember(member: Member) {
        this.server.emit('addMember', member);

    }

}
