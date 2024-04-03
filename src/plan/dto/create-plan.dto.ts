import { PickType } from "@nestjs/mapped-types";
import { Plan } from "../entities/plan.entity";
import { IsString } from "class-validator";


export class CreatePlanDto extends PickType(Plan, ["name", "image"]) {
    @IsString()
    name: string;

    @IsString()
    image: string;
}
