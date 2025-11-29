import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import {
    CreatedResponse,
    OkResponse,
} from '../shared/decorators';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { ApplicationService } from './application.service';
import { CreateStandaloneAnswerDto } from './dto/create-answer.dto';
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
        @Body() createAnswerDto: CreateStandaloneAnswerDto,
    ): Promise<GenericResponse<Answer>> {
        this.logger.debug('Received answer creation request:', JSON.stringify(createAnswerDto));
        const results = await this.applicationService.createAnswer(
            createAnswerDto,
        );

        return { message: 'Answer created successfully', results };
    }
}

