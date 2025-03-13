import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Category } from '../category/entities/category.entity';
import { Section } from '../section/entities/section.entity';
import {
    CreatedResponse,
    ErrorResponses,
    ForbiddenResponse,
    OkResponse,
    PageResponse,
    Paginated,
    PaginationParams,
    QueryParam,
    UnauthorizedResponse,
} from '../shared/decorators';
import { Roles } from '../shared/enums/roles.enum';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { User } from '../users/entities/user.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionFilterOptionsDto } from './dto/question-filter-options.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';

/**
 * @Controller Question endpoints
 */
@Controller('questions')
@ApiTags('Questions')
@ApiExtraModels(Question, Category, Section)
@Auth()
@ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    @Auth(Roles.DBI_ADMIN)
    @CreatedResponse(Question)
    async create(
        @Body() createQuestionDto: CreateQuestionDto,
    ): Promise<GenericResponse<Question>> {
        const results = await this.questionService.create(createQuestionDto);
        return {
            message: 'Question created successfully',
            results,
        };
    }

    @Get()
    @Paginated()
    @PageResponse(Question)
    async findAll(
        @PaginationParams() options: IPagination,
        @Query() filterOptions: QuestionFilterOptionsDto,
        @GetUser() user: User,
    ): Promise<GenericResponse<IPage<Question>>> {
        const results = await this.questionService.findAll(
            options,
            user.role,
            filterOptions,
        );
        return {
            message: 'Questions retrieved successfully',
            results,
        };
    }

    @Get(':id')
    @OkResponse(Question)
    async findOne(
        @Param('id', ParseIntPipe) id: string,
    ): Promise<GenericResponse<Question>> {
        const results = await this.questionService.findOne(+id);
        return {
            message: 'Question retrieved',
            results,
        };
    }

    @Put(':id')
    @Auth(Roles.DBI_ADMIN)
    @OkResponse(Question)
    async update(
        @Param('id') id: string,
        @Body() updateQuestionDto: UpdateQuestionDto,
    ): Promise<GenericResponse<Question>> {
        const results = await this.questionService.update(
            +id,
            updateQuestionDto,
        );
        return {
            message: 'Question updated successfully',
            results,
        };
    }

    @Delete(':id')
    @Auth(Roles.DBI_ADMIN)
    @OkResponse()
    async remove(@Param('id') id: string): Promise<GenericResponse<void>> {
        await this.questionService.remove(+id);
        return { message: 'Question deleted' };
    }

    @Patch(':id/add-category')
    @Auth(Roles.DBI_ADMIN)
    @OkResponse()
    @QueryParam('categoryId')
    async addCategory(
        @Param('id') id: string,
        @Query('categoryId', ParseIntPipe) categoryId: string,
    ): Promise<GenericResponse<void>> {
        await this.questionService.addCategory(+id, +categoryId);
        return { message: 'Category added' };
    }

    @Patch(':id/remove-category')
    @OkResponse()
    @QueryParam('categoryId')
    async removeCategory(
        @Param('id') id: string,
        @Query('categoryId', ParseIntPipe) categoryId: string,
    ): Promise<GenericResponse<void>> {
        await this.questionService.removeCategory(+id, +categoryId);
        return { message: 'Category remvoved' };
    }

    @Patch(':id/toggle-active')
    @OkResponse()
    async toggleActive(
        @Param('id', ParseIntPipe) id: string,
    ): Promise<GenericResponse<void>> {
        const results = await this.questionService.toggleActive(+id);
        return {
            message: `Question ${results ? 'activated' : 'deactivated'}`,
        };
    }

    @Get('sections/:sectionId')
    @OkResponse()
    async findQuestionsBySection(
        @Param('sectionId', ParseIntPipe) sectionId: string,
    ): Promise<GenericResponse<Question[]>> {
        const results = await this.questionService.findBySection(+sectionId);
        return {
            message: 'Questions retrieved successfully',
            results,
        };
    }
}
