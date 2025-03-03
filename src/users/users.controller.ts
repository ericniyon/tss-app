import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Put,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
    CreatedResponse,
    ErrorResponses,
    ForbiddenResponse,
    OkArrayResponse,
    OkResponse,
    PageResponse,
    Paginated,
    PaginationParams,
    UnauthorizedResponse,
} from '../shared/decorators';
import { Roles } from '../shared/enums/roles.enum';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { IPagination } from '../shared/interfaces/page.interface';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@Auth(Roles.DBI_ADMIN)
@ApiTags('User')
@ApiExtraModels(User)
@ErrorResponses(ForbiddenResponse, UnauthorizedResponse)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @CreatedResponse(User)
    async create(
        @Body() createUserAccountDto: CreateUserAccountDto,
    ): Promise<GenericResponse<User>> {
        const results = await this.usersService.create(createUserAccountDto);
        return { message: 'User created successfully', results };
    }

    @Get()
    @PageResponse(User)
    @Paginated()
    @HttpCode(HttpStatus.OK)
    async getUsers(@PaginationParams() options: IPagination): Promise<any> {
        const results = await this.usersService.findAll(options);
        return { message: 'Users retrieved successfully', results };
    }

    @Get('experts')
    @OkArrayResponse(User)
    @HttpCode(HttpStatus.OK)
    async getExperts(): Promise<any> {
        const results = await this.usersService.findAllExperts();
        return { message: 'Experts retrieved successfully', results };
    }

    @Patch('/activate/:id')
    @OkResponse()
    @HttpCode(HttpStatus.OK)
    async activate(
        @Param('id') id: string,
        @GetUser() user: User,
    ): Promise<GenericResponse<void>> {
        await this.usersService.activate(+id, user);
        return { message: 'User activated successfully', results: null };
    }

    @Put(':id')
    @OkResponse()
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateUserAccountDto: UpdateUserAccountDto,
    ): Promise<GenericResponse<void>> {
        await this.usersService.update(+id, updateUserAccountDto);
        return { message: 'User updated successfully', results: null };
    }

    @Delete(':id')
    @OkResponse()
    @HttpCode(HttpStatus.OK)
    async remove(
        @Param('id') id: string,
        @GetUser() user: User,
    ): Promise<GenericResponse<void>> {
        await this.usersService.remove(+id, user);
        return { message: 'User deleted successfully', results: null };
    }
}
