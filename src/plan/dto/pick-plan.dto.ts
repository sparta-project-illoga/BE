import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CategoryName } from 'src/category/types/category.type';

export class PickPlanDto{

    @IsString()
    name: string;

    @IsEnum(CategoryName)
    @IsOptional()
    category?: CategoryName

    @IsString()
    @IsOptional()
    place?: string

    @IsNumber()
    @IsOptional()
    date? : number
    
    @IsNumber()
    @IsOptional()
    money?: number
}
