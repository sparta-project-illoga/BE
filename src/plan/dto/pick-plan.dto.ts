import { PickType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';
import { Plan } from '../entities/plan.entity';

export class PickPlanDto{

    @IsString()
    name: string;

    @IsNumber()
    pickplan: number;
}
