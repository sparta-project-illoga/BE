import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateUserDto {
  @ApiProperty({
    example: 'nickname',
    description: '유저 닉네임',
    required: false,
  })
  @IsOptional()
  @IsString()
  nickname: string

  @ApiProperty({
    example: '010-1234-1234',
    description: '유저 전화번호',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone: string

  @ApiProperty({
    example: 'https://example.com/user-image.jpg',
    description: '유저 이미지 URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  image_url: string
}
