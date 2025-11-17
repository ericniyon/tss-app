import { Response } from 'express';
import { Question } from '../question/entities/question.entity';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { User } from '../users/entities/user.entity';
import { ApplicationService } from './application.service';
import { AddAssigneesDto } from './dto/add-assignees.dto';
import { ApplicationFilterOptionsDto } from './dto/application-filter-options.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewAnswersDto, UpdateAnswerStatusDto } from './dto/update-answer-status.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { Application } from './entities/application.entity';
export declare class ApplicationController {
    private readonly applicationService;
    constructor(applicationService: ApplicationService);
    create(createApplicationDto: CreateApplicationDto, user: User): Promise<GenericResponse<Application>>;
    findAll(user: User, options: IPagination, filterOptions: ApplicationFilterOptionsDto): Promise<GenericResponse<IPage<Application>>>;
    findLatestPending(user: User): Promise<GenericResponse<Application>>;
    findCurrentApplicationOrCertificate(user: User): Promise<GenericResponse<{
        ongoingApplication: number;
        currentCertificate: number;
    }>>;
    findQuestions(categoryId: string): Promise<GenericResponse<Question[]>>;
    exportAllAnswers(categoryId: string, year: string, res: Response): Promise<GenericResponse<any>>;
    joinInterview(applicationId: number, user: User): Promise<GenericResponse<void>>;
    findOne(id: string): Promise<GenericResponse<Application>>;
    updateStatus(id: string, updateStatusDto: UpdateApplicationStatusDto): Promise<GenericResponse<Application>>;
    updateAnswerStatus(id: string, updateAnswerStatusDto: UpdateAnswerStatusDto): Promise<GenericResponse<void>>;
    reviewAnswers(id: string, dto: ReviewAnswersDto): Promise<GenericResponse<void>>;
    update(id: string, updateApplicationDto: UpdateApplicationDto, user: User): Promise<GenericResponse<Application>>;
    addAssignees(id: string, addAssigneesDto: AddAssigneesDto): Promise<GenericResponse<Application>>;
    removeAssignee(id: string, assigneeId: string): Promise<GenericResponse<Application>>;
    submitApplication(id: string, user: User): Promise<GenericResponse<void>>;
    remove(id: string): Promise<GenericResponse<void>>;
    findDeniedAnswers(id: string): Promise<GenericResponse<Application>>;
}
