import { EntityManager } from 'typeorm';
export declare class QuestionSeedService {
    private readonly entityManager;
    constructor(entityManager: EntityManager);
    seed(): Promise<void>;
}
