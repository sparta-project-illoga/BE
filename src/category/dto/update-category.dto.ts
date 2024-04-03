import { IsEnum, IsNotEmpty } from "class-validator";
import { CategoryName } from "../types/category.type";

export class UpdateCategoryDto {
    @IsEnum(CategoryName)
    @IsNotEmpty({ message: '수정한 카테고리를 입력해주세요.' })
    category_name: CategoryName;
}