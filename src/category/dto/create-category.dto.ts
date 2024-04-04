import { IsEnum, IsNotEmpty } from "class-validator";
import { CategoryName } from "../types/category.type";

export class CreateCategoryDto {
    @IsEnum(CategoryName)
    @IsNotEmpty({ message: '해당하는 카테고리를 입력해주세요.' })
    category_name: CategoryName;
}