import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Members } from 'src/member/decorators/member.decorator';
import { MemberType } from 'src/member/types/member.type';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { MemberGuard } from 'src/utils/member.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateMessageDto } from './dto/update-chat.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

//해당 유저/플랜에 해당되는 멤버만
@UseGuards(AuthGuard('jwt'))
@UseGuards(MemberGuard)
@Controller('chat')
@ApiTags('채팅 API')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  //채팅방 만들기
  //memberguard : leader만 가능
  // @Members(MemberType.Leader)
  @Post('plan/:planId')
  @ApiOperation({ summary: '채팅방 생성 API', description: '플랜 멤버들을 포함한 채팅방을 생성한다.' })
  async createRoom(@Param('planId') planId: number, @Body() createChatDto: CreateChatDto) {
    console.log("채팅방 만들기 planId,채팅방이름 : ", planId, createChatDto.name);
    const room = await this.chatService.createRoom(planId, createChatDto.name);
    return {
      statusCode: HttpStatus.OK,
      message: `${room.name} 채팅방 생성에 성공했습니다.`,
      room,
    }
  }

  //채팅 입력하기
  //user가 null로 읽힘
  @Post('room/:roomId/content')
  @ApiOperation({ summary: '채팅 입력 API', description: '채팅방에서 채팅을 입력한다.' })
  async create(@Param('roomId') roomId: number, @UserInfo() user: User, @Body() createMessageDto: CreateMessageDto) {
    const text = await this.chatService.createMessage(roomId, user.id, createMessageDto.text);
    return {
      statusCode: HttpStatus.OK,
      message: '채팅 입력에 성공했습니다.',
      text,
    }
  }

  //채팅 내용 조회
  //채팅방 정보도 같이 조회
  @Get('room/:roomId/content')
  @ApiOperation({ summary: '채팅 내용 조회 API', description: '채팅방에서 입력한 채팅들을 조회한다.' })
  async findAll(@Param('roomId') roomId: number) {
    const chat = await this.chatService.findAll(roomId);

    return {
      statusCode: HttpStatus.OK,
      message: '채팅방 내용 조회에 성공했습니다.',
      chat,
    }
  }

  //유저가 속한 플랜과 채팅방 조회
  @Get('planNchat')
  @ApiOperation({ summary: '플랜과 채팅방 조회', description: 'userId를 주면 해당 유저가 속한 플랜과 채팅방을 조회한다.' })
  async getPlanNChat(@UserInfo() user: User) {
    const myPlanChats = await this.chatService.getPlanNChat(user.id);

    return {
      statusCode: HttpStatus.OK,
      message: '내 플랜과 채팅방 조회에 성공했습니다.',
      myPlanChats,
    }
  }


}