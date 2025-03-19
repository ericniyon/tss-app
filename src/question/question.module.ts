import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Section } from '../section/entities/section.entity';
import { Question } from './entities/question.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Subsection } from 'src/subsection/entities/subsection.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Question,
            Category,
            Section,
            Subsection,
            Subcategory,
        ]),
    ],
    controllers: [QuestionController],
    providers: [QuestionService],
})
export class QuestionModule {}
