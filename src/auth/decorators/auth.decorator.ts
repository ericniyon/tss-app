import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { Roles } from '../../shared/enums/roles.enum';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from './roles.decorator';

export function Auth(...roles: Roles[]) {
    return applyDecorators(
        ApiCookieAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Role(...roles),
    );
}
