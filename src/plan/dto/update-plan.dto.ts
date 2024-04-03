import { PartialType, PickType } from '@nestjs/mapped-types';
import { Plan } from '../entities/plan.entity';
import { IsString } from 'class-validator';

export class UpdatePlanDto extends PickType(Plan, ["name"]) {
    @IsString()
    name: string;
}
