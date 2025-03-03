import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';
import { PASSWORD_REGEX } from '../../shared/constant/regex.constant';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(13)
    phone: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(PASSWORD_REGEX, {
        message:
            'Password should contain at least 8 characters, lowercase, uppercase, and a symbol',
    })
    password: string;
}
