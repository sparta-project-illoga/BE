import { PickType } from "@nestjs/mapped-types";
import { Plan } from "../entities/plan.entity";
import { IsString } from "class-validator";


export class CreatePlanDto {
    @IsString()
    name: string;

}
