import { PickType } from "@nestjs/mapped-types";
import { Schedule } from "../entities/schedule.entity"
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateScheduleDto extends PickType(Schedule, ["place", "money"]) {
    @IsNotEmpty({ message: "지역을 입력해주세요"})
    @IsString()
    place: string;

    @IsNotEmpty({ message: "예산을 입력해주세요"})
    @IsNumber()
    money: number;
}
