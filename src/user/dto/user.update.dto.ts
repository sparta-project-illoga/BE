import { IsNotEmpty, IsOptional, IsString } from "class-validator"


export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nickname: string

  @IsOptional()
  @IsString()
  phone: string

  @IsOptional()
  @IsString()
  image_url: string
}
