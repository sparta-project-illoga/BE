import { ChatContent } from "src/chat/entities/chat_contents.entity";
import { ChatRoom } from "src/chat/entities/chat_rooms.entity";

export interface ServerToClientEvents {
    newRoom: (payload: ChatRoom) => void;
    newMessage: (payload: ChatContent) => void;
}