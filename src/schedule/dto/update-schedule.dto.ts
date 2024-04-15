import { PickType } from "@nestjs/mapped-types";
import { Schedule } from "../entities/schedule.entity";
import { IsNumber, IsString } from "class-validator";

export class UpdateScheduleDto extends PickType(Schedule, [ "money"]) {  
    @IsNumber()
    placecode: number;

    @IsNumber()
    money: number;
}