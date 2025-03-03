import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../shared/constant/regex.constant';

export class ResetPasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(PASSWORD_REGEX, { message: 'Password is too weak' })
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;
}
