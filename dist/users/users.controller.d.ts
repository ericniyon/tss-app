import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { IPagination } from '../shared/interfaces/page.interface';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserAccountDto: CreateUserAccountDto): Promise<GenericResponse<User>>;
    getUsers(options: IPagination): Promise<any>;
    getExperts(): Promise<any>;
    activate(id: string, user: User): Promise<GenericResponse<void>>;
    update(id: string, updateUserAccountDto: UpdateUserAccountDto): Promise<GenericResponse<void>>;
    remove(id: string, user: User): Promise<GenericResponse<void>>;
}
