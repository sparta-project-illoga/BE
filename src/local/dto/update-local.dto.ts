import { PartialType } from '@nestjs/mapped-types';
import { CreateLocalDto } from './create-local.dto';

export class UpdateLocalDto extends PartialType(CreateLocalDto) {}
