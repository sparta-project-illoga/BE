import { PickType } from "@nestjs/mapped-types";
import { Schedule } from "../entities/schedule.entity"
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateScheduleDto extends PickType(Schedule, ["money", "date"]) {
    
    @IsNotEmpty({ message: "일정을 입력해주세요"})
    @IsNumber()
    date: number;
    
    @IsNotEmpty({ message: "지역코드을 입력해주세요"})
    @IsNumber()
    placecode: number;

    @IsNotEmpty({ message: "예산을 입력해주세요"})
    @IsNumber()
    money: number;
}
