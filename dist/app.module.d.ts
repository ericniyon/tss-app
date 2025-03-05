import { OnApplicationBootstrap } from '@nestjs/common';
import { ApplicationSeedService } from './shared/seed/application.seed-service';
import { CategorySeedService } from './shared/seed/category.seed-service';
import { QuestionSeedService } from './shared/seed/question.seed-service';
import { SectionSeedService } from './shared/seed/section.seed-service';
import { UserSeedService } from './shared/seed/user.seed-service';
export declare class AppModule implements OnApplicationBootstrap {
    private readonly userSeedService;
    private readonly categorySeedService;
    private readonly sectionSeedService;
    private readonly questionSeedService;
    private readonly applicationSeedService;
    constructor(userSeedService: UserSeedService, categorySeedService: CategorySeedService, sectionSeedService: SectionSeedService, questionSeedService: QuestionSeedService, applicationSeedService: ApplicationSeedService);
    onApplicationBootstrap(): Promise<void>;
}
