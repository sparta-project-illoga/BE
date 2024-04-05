import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Members } from 'src/member/decorators/member.decorator';
import { MemberType } from 'src/member/types/member.type';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { MemberGuard } from 'src/utils/member.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  //채팅방 만들기
  //memberguard : leader만 가능
  @Members(MemberType.Leader)
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

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
