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
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Question } from '../question/entities/question.entity';
import {
    CreatedResponse,
    OkArrayResponse,
    OkResponse,
    PageResponse,
    Paginated,
    PaginationParams,
    QueryParam,
} from '../shared/decorators';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { User } from '../users/entities/user.entity';
import { ApplicationService } from './application.service';
import { AddAssigneesDto } from './dto/add-assignees.dto';
import { ApplicationFilterOptionsDto } from './dto/application-filter-options.dto';
import { ApplicationResponseDto } from './dto/application-response.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import {
    ReviewAnswersDto,
    UpdateAnswerStatusDto,
} from './dto/update-answer-status.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { Application } from './entities/application.entity';
import { Roles } from '../shared/enums/roles.enum';
import { Role } from '../auth/decorators/roles.decorator';
import { createReadableStream } from '../shared/utils/file.util';

@Controller('applications')
@ApiTags('Applications')
@ApiExtraModels(Application, Question, ApplicationResponseDto)
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) {}

    @Auth()
    @Post()
    @CreatedResponse(Application)
    async create(
        @Body() createApplicationDto: CreateApplicationDto,
        @GetUser() user: User,
    ): Promise<GenericResponse<Application>> {
        const results = await this.applicationService.create(
            createApplicationDto,
            user,
        );

        return { message: 'Application created successfully', results };
    }

    @Auth()
    @Get()
    @Paginated()
    @PageResponse(Application)
    async findAll(
        @GetUser() user: User,
        @PaginationParams() options: IPagination,
        @Query() filterOptions: ApplicationFilterOptionsDto,
    ): Promise<GenericResponse<IPage<Application>>> {
        const results = await this.applicationService.findAll(
            user,
            options,
            filterOptions,
        );
        return { message: 'Applications retrieved successfully', results };
    }

    @Auth()
    @Get('latest-pending')
    @OkResponse(Application)
    async findLatestPending(
        @GetUser() user: User,
    ): Promise<GenericResponse<Application>> {
        return {
            message: 'Application retrieved successfully',
            results: await this.applicationService.findLatestPending(user),
        };
    }

    @Auth()
    @Get('current')
    @OkResponse(Application)
    async findCurrentApplicationOrCertificate(@GetUser() user: User): Promise<
        GenericResponse<{
            ongoingApplication: number;
            currentCertificate: number;
        }>
    > {
        return {
            message: 'Application status retrieved successfully',
            results:
                await this.applicationService.findCurrentApplicationOrCertificate(
                    user,
                ),
        };
    }

    @Auth()
    @Get('/questions')
    @QueryParam('category', true)
    @OkArrayResponse(Question)
    async findQuestions(
        @Query('category') categoryId: string,
    ): Promise<GenericResponse<Question[]>> {
        return {
            message: 'Questions retrieved successfully',
            results: await this.applicationService.findQuestions(+categoryId),
        };
    }

    // Export all answers and return a downloadable file
    @Get('export-answers')
    async exportAllAnswers(
        @Query('category') categoryId: string,
        @Query('year') year: string,
        @Res() res: Response,
    ): Promise<GenericResponse<any>> {
        const { fileName, buffer } =
            await this.applicationService.exportAllAnswersToExcel(
                +categoryId,
                +year,
            );

        const stream = createReadableStream(buffer);

        res.set({
            'Content-Type':
                'application/vnd.openxmlIdformats-officedocument.spreadsheetml.sheet',
            'Content-Length': buffer.length,
            'Content-Disposition': `attachment; filename="${fileName}"`,
        });
        stream.pipe(res);
        return {
            message: 'Answers downloaded',
        };
    }

    @Auth()
    @Post('join-interview')
    @OkResponse()
    async joinInterview(
        @Body('applicationId', ParseIntPipe) applicationId: number,
        @GetUser() user: User,
    ): Promise<GenericResponse<void>> {
        await this.applicationService.joinInterview(applicationId, user);
        return { message: 'Successfully joined interview' };
    }

    @Auth()
    @Get(':id/snapshot')
    @OkResponse(ApplicationResponseDto)
    async findLatestSnapshot(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<GenericResponse<Application>> {
        return {
            message: 'Application snapshot retrieved successfully',
            results: (await this.applicationService.findLatestSnapshot(
                id,
                user,
            )) as unknown as Application,
        };
    }

    @Auth()
    @Get(':id')
    @OkResponse(ApplicationResponseDto)
    async findOne(
        @Param('id') id: string,
    ): Promise<GenericResponse<Application>> {
        return {
            message: 'Application retrieved successfully',
            results: await this.applicationService.findOne({
                where: { id: +id },
            }),
        };
    }

    @Patch(':id/status')
    @OkResponse(Application)
    @Auth(Roles.DBI_ADMIN, Roles.DBI_EXPERT)
    async updateStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateApplicationStatusDto,
    ): Promise<GenericResponse<Application>> {
        return {
            message: 'Application updated successfully',
            results: await this.applicationService.updateStatus(
                +id,
                updateStatusDto.status,
                updateStatusDto.setupFee,
                updateStatusDto.subscriptionFee,
            ),
        };
    }

    // TODO: Delete this endpoint
    @Patch('answers/:id/status')
    @OkResponse()
    @Auth()
    async updateAnswerStatus(
        @Param('id', ParseIntPipe) id: string,
        @Body() updateAnswerStatusDto: UpdateAnswerStatusDto,
    ): Promise<GenericResponse<void>> {
        await this.applicationService.updateAnswerStatus(
            +id,
            updateAnswerStatusDto.status,
        );
        return { message: 'Status updated successfully' };
    }

    @Patch(':id/review')
    @OkResponse()
    @Auth(Roles.DBI_ADMIN, Roles.DBI_EXPERT)
    async reviewAnswers(
        @Param('id', ParseIntPipe) id: string,
        @Body() dto: ReviewAnswersDto,
    ): Promise<GenericResponse<void>> {
        await this.applicationService.reviewAnswers(+id, dto);
        return { message: 'Answers updated successfully' };
    }

    @Put(':id')
    @OkResponse(Application)
    @Auth()
    async update(
        @Param('id') id: string,
        @Body() updateApplicationDto: UpdateApplicationDto,
        @GetUser() user: User,
    ): Promise<GenericResponse<Application>> {
        const results = await this.applicationService.update(
            +id,
            updateApplicationDto,
            user,
        );
        return {
            message: 'Application updated successfully',
            results,
        };
    }

    @Patch(':id/add-assignee')
    @OkResponse(Application)
    @Auth(Roles.DBI_ADMIN)
    async addAssignees(
        @Param('id') id: string,
        @Body() addAssigneesDto: AddAssigneesDto,
    ): Promise<GenericResponse<Application>> {
        const results = await this.applicationService.addAssignees(
            +id,
            addAssigneesDto,
        );
        return {
            message: 'Assignee added successfully',
            results,
        };
    }
    @Patch(':id/remove-assignee')
    @OkResponse(Application)
    @QueryParam('assigneeId')
    @Auth(Roles.DBI_ADMIN)
    async removeAssignee(
        @Param('id') id: string,
        @Query('assigneeId', ParseIntPipe) assigneeId: string,
    ): Promise<GenericResponse<Application>> {
        const results = await this.applicationService.removeAssignee(
            +id,
            +assigneeId,
        );
        return {
            message: 'Assignee removed successfully',
            results,
        };
    }
    @Patch(':id/submit')
    @OkResponse()
    @Auth()
    async submitApplication(
        @Param('id', ParseIntPipe) id: string,
        @GetUser() user: User,
    ): Promise<GenericResponse<void>> {
        await this.applicationService.submit(+id, user);
        return { message: 'Application submitted successfully' };
    }

    @Delete(':id')
    @OkResponse()
    @Role(Roles.DBI_ADMIN)
    async remove(@Param('id') id: string): Promise<GenericResponse<void>> {
        await this.applicationService.remove(+id);
        return {
            message: 'Application deleted',
        };
    }

    @Get(':id/denied-answers')
    @OkResponse(ApplicationResponseDto)
    async findDeniedAnswers(
        @Param('id') id: string,
    ): Promise<GenericResponse<Application>> {
        return {
            message: 'Application retrieved successfully',
            results: await this.applicationService.findDeniedAnswers(+id),
        };
    }
}
