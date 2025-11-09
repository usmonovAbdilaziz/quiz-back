import { PartialType } from '@nestjs/mapped-types';
import { CreateResultDto } from './create-resault.dto';

export class UpdateResaultDto extends PartialType(CreateResultDto) {}
