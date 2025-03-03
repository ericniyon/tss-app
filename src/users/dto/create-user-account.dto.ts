import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import * as omit from 'lodash.omit';
import { Roles } from '../../shared/enums/roles.enum';

export class CreateUserAccountDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ enum: omit(Roles, ['COMPANY']) })
    @IsEnum(omit(Roles, ['COMPANY']))
    @IsNotEmpty()
    role: Roles;
}
