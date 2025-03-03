import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Section } from '../section/entities/section.entity';
import { Question } from './entities/question.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
    imports: [TypeOrmModule.forFeature([Question, Category, Section])],
    controllers: [QuestionController],
    providers: [QuestionService],
})
export class QuestionModule {}
