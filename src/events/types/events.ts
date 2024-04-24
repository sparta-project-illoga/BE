import { ChatContent } from "src/chat/entities/chat_contents.entity";
import { ChatRoom } from "src/chat/entities/chat_rooms.entity";
import { Member } from "src/member/entities/member.entity";

export interface ServerToClientEvents {
    newRoom: (payload: ChatRoom) => void;
    newMessage: (payload: ChatContent) => void;
    addMember: (payload: Member) => void;
    //단순히 서버와 클라이언트 연결 상태 나타내려는 것이므로 매개 변수 필요 없음
    connected: () => void;
    responseMessage: (payload: { name: string; chat: string }) => void;
    memberJoined: (payload: { userId: number }) => void;
    typing: (payload: { nickname: string, isTyping: boolean }) => void;
}