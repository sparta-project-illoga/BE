import { IsNotEmpty, IsString } from "class-validator";

export class CreateMemberDto {
    @IsString()
    @IsNotEmpty({ message: '해당 플랜에 초대할 멤버의 닉네임을 입력해주세요.' })
    nickname: string;
}
