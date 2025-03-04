import { EntityManager } from 'typeorm';
export declare class CategorySeedService {
    private readonly entityManager;
    constructor(entityManager: EntityManager);
    seed(): Promise<void>;
}
