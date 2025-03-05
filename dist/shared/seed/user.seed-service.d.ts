import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';
import { PasswordEncryption } from '../utils/PasswordEncryption';
export declare class UserSeedService {
    private readonly entityManager;
    private passwordEncryption;
    private configService;
    constructor(entityManager: EntityManager, passwordEncryption: PasswordEncryption, configService: ConfigService);
    seed(): Promise<void>;
}
