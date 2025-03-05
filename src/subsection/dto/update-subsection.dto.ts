import { PartialType } from '@nestjs/swagger';
import { CreateSubsectionDto } from './create-subsection.dto';

export class UpdateSubsectionDto extends PartialType(CreateSubsectionDto) {}
