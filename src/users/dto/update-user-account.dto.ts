import { PartialType } from '@nestjs/swagger';
import { CreateUserAccountDto } from './create-user-account.dto';

export class UpdateUserAccountDto extends PartialType(CreateUserAccountDto) {}
