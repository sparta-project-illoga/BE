import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateMemberDto {
    @IsNumber()
    @IsNotEmpty({ message: '해당 플랜에 초대할 멤버(userId값)를 입력해주세요.' })
    userId: number;
}
