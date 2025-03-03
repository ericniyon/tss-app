import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Not, Repository } from 'typeorm';
import { SendGridService } from '../notification/sendgrid.service';
import { Roles } from '../shared/enums/roles.enum';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { ConfirmationEmailTemplate } from '../shared/templates/confirmation-email';
import { generatePassword } from '../shared/utils/password-generator';
import { PasswordEncryption } from '../shared/utils/PasswordEncryption';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly sendGridService: SendGridService,
        private readonly configService: ConfigService,
        private readonly passwordEncryption: PasswordEncryption,
    ) {}
    async create(createUserAccountDto: CreateUserAccountDto): Promise<any> {
        const randPassword = generatePassword();
        const password = await this.passwordEncryption.hashPassword(
            randPassword,
        );
        if (
            await this.userRepository.findOne({
                where: { email: createUserAccountDto.email },
            })
        )
            throw new BadRequestException('Account already exists');
        const results = await this.userRepository.save({
            ...new User(),
            ...createUserAccountDto,
            verified: true,
            password,
        } as User);
        const confirmationMail = {
            to: results.email,
            subject: 'Trust seal account confirmation',
            from: this.configService.get('sendgrid').fromEmail,
            text: `Account creation confirmation`,
            html: ConfirmationEmailTemplate(
                results.name.split(' ')[0],
                randPassword,
                this.configService.get('web').adminUrl,
            ),
        };
        await this.sendGridService.send(confirmationMail);
        delete results.password;
        return results;
    }

    async findAll(options: IPagination): Promise<IPage<User>> {
        const { items, meta } = await paginate(this.userRepository, options, {
            where: {
                role: Not(Roles.COMPANY),
            },
            order: {
                name: 'ASC',
            },
            select: [
                'id',
                'email',
                'name',
                'phone',
                'verified',
                'activated',
                'role',
            ],
        });
        return { items, ...meta };
    }
    async findAllExperts(): Promise<User[]> {
        return await this.userRepository.find({
            where: { role: Roles.DBI_EXPERT, activated: true },
            select: ['id', 'name'],
            order: { name: 'ASC' },
        });
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            id,
            deletedAt: null,
        });
        if (!user) throw new NotFoundException('User with this id not found');
        return user;
    }

    async activate(id: number, { email }: User): Promise<void> {
        const user = await this.findOne(id);
        if (user.email === email)
            throw new BadRequestException(
                'This operation is not applicable to yourself',
            );
        user.activated = !user.activated;
        if (!user.verified) user.verified = true;
        await this.userRepository.save(user);
    }

    async update(
        id: number,
        updateUserAccountDto: UpdateUserAccountDto,
    ): Promise<void> {
        await this.findOne(id);
        await this.userRepository.update(id, updateUserAccountDto);
    }

    async remove(id: number, { email }: User): Promise<void> {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('User with this id not found');
        }
        if (user.email === email)
            throw new BadRequestException(
                'This operation is not applicable to yourself',
            );
        await this.userRepository.softDelete(id);
        await this.userRepository.update(id, { email: `${user.email}${id}` });
    }
}
