import { EntityManager } from 'typeorm';
export declare class SectionSeedService {
    private readonly entityManager;
    constructor(entityManager: EntityManager);
    seed(): Promise<void>;
}
