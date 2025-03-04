import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { SendGridService } from '../notification/sendgrid.service';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { PasswordEncryption } from '../shared/utils/PasswordEncryption';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private userRepository;
    private readonly sendGridService;
    private readonly configService;
    private readonly passwordEncryption;
    constructor(userRepository: Repository<User>, sendGridService: SendGridService, configService: ConfigService, passwordEncryption: PasswordEncryption);
    create(createUserAccountDto: CreateUserAccountDto): Promise<any>;
    findAll(options: IPagination): Promise<IPage<User>>;
    findAllExperts(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    activate(id: number, { email }: User): Promise<void>;
    update(id: number, updateUserAccountDto: UpdateUserAccountDto): Promise<void>;
    remove(id: number, { email }: User): Promise<void>;
}
