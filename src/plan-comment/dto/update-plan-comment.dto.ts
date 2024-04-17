import { PartialType } from '@nestjs/swagger';
import { CreatePlanCommentDto } from './create-plan-comment.dto';

export class UpdatePlanCommentDto extends PartialType(CreatePlanCommentDto) {}
