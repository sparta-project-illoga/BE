import { PickType } from "@nestjs/mapped-types";
import { Schedule } from "../entities/schedule.entity";
import { IsNumber, IsString } from "class-validator";

export class UpdateScheduleDto extends PickType(Schedule, ["place", "money"]) {  
    @IsString()
    place: string;

    @IsNumber()
    money: number;
}