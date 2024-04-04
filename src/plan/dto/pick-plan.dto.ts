import { IsNumber } from 'class-validator';

export class PickPlanDto {

    @IsNumber()
    pickplan: number;
}
