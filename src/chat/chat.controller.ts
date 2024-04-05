import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Members } from 'src/member/decorators/member.decorator';
import { MemberType } from 'src/member/types/member.type';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { MemberGuard } from 'src/member/guards/member.guard';
import { AuthGuard } from '@nestjs/passport';

//해당 유저/플랜에 해당되는 멤버만
@UseGuards(AuthGuard('jwt'))
@UseGuards(MemberGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  //채팅방 만들기
  //memberguard : leader만 가능
  //@Members(MemberType.Leader)
  @Post(':planId')
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
  @Post('content/:roomId')
  async create(@Param('roomId') roomId: number, @UserInfo() user: User, @Body() createMessageDto: CreateMessageDto) {
    const text = await this.chatService.createMessage(roomId, user.id, createMessageDto.text);
    return {
      statusCode: HttpStatus.OK,
      message: '채팅 입력에 성공했습니다.',
      text,
    }
  }

  //채팅 내용 조회
  @Get('content/:roomId')
  async findAll(@Param('roomId') roomId: number) {
    const text = await this.chatService.findAll(roomId);

    return {
      statusCode: HttpStatus.OK,
      message: '채팅방 내용 조회에 성공했습니다.',
      text,
    }
  }
}
