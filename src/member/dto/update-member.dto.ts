import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateMemberDto {
    @IsNumber()
    @IsNotEmpty({ message: '수정한 멤버(userId값)를 입력해주세요.' })
    userId: number;
}
