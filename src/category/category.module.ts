import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from '../subcategory/entities/subcategory.entity';
import { Section } from '../section/entities/section.entity';
import { Subsection } from '../subsection/entities/subsection.entity';
import { Question } from '../question/entities/question.entity';
import { Application } from '../application/entities/application.entity';
import { Answer } from '../application/entities/answer.entity';
import { Certificate } from '../certificate/entities/certificate.entity';
import { Notification } from '../notification/entities/notification.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Category,
            Subcategory,
            Section,
            Subsection,
            Question,
            Application,
            Answer,
            Certificate,
            Notification,
        ]),
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
})
export class CategoryModule {}
