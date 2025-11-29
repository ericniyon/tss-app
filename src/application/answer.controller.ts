import {
    Body,
    Controller,
    Logger,
    Post,
    Req,
    RawBodyRequest,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Auth } from '../auth/decorators/auth.decorator';
import {
    CreatedArrayResponse,
    CreatedResponse,
    OkArrayResponse,
    OkResponse,
} from '../shared/decorators';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { ApplicationService } from './application.service';
import {
    CreateStandaloneAnswerDto,
    CreateBulkStandaloneAnswersDto,
} from './dto/create-answer.dto';
import { Answer } from './entities/answer.entity';

@Controller('answers')
@ApiTags('Answers')
@ApiExtraModels(Answer)
export class AnswerController {
    private readonly logger = new Logger(AnswerController.name);

    constructor(private readonly applicationService: ApplicationService) {}

    @Auth()
    @Post()
    @CreatedResponse(Answer)
    async create(
        @Req() req: RawBodyRequest<Request>,
        @Body() createAnswerDto: CreateStandaloneAnswerDto,
    ): Promise<GenericResponse<Answer>> {
        this.logger.debug('Raw request body:', JSON.stringify(req.body));
        this.logger.debug('Parsed DTO:', JSON.stringify(createAnswerDto));
        this.logger.debug('DTO type check:', {
            applicationId: typeof createAnswerDto?.applicationId,
            questionId: typeof createAnswerDto?.questionId,
            questionText: typeof createAnswerDto?.questionText,
            responses: Array.isArray(createAnswerDto?.responses),
        });
        
        const results = await this.applicationService.createAnswer(
            createAnswerDto,
        );

        return { message: 'Answer created successfully', results };
    }

    @Auth()
    @Post('bulk')
    @CreatedArrayResponse(Answer)
    async createBulk(
        @Body() createBulkAnswersDto: CreateBulkStandaloneAnswersDto,
    ): Promise<GenericResponse<Answer[]>> {
        this.logger.debug(
            'Received bulk answer creation request:',
            JSON.stringify(createBulkAnswersDto),
        );

        const results = await this.applicationService.createBulkAnswers(
            createBulkAnswersDto,
        );

        return {
            message: `${results.length} answer(s) created successfully`,
            results,
        };
    }
}

