import { EntityManager } from 'typeorm';
import { ApplicationService } from '../../application/application.service';
import { EApplicationStatus } from '../../application/enums';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../users/entities/user.entity';
export declare class ApplicationSeedService {
    private readonly entityManager;
    private readonly applicationService;
    constructor(entityManager: EntityManager, applicationService: ApplicationService);
    seed(): Promise<void>;
    createApplication(status: EApplicationStatus, user: User, categories: Category[]): Promise<void>;
}
