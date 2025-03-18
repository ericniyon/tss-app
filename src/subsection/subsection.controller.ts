import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {
    CreatedResponse,
    ErrorResponses,
    ForbiddenResponse,
    OkResponse,
    PageResponse,
    Paginated,
    PaginationParams,
    UnauthorizedResponse,
} from 'src/shared/decorators';
import { Roles } from 'src/shared/enums/roles.enum';
import { Subsection } from './entities/subsection.entity';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { SubsectionService } from './subsection.service';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { CreateSubsectionDto } from './dto/create-subsection.dto';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { SubsectionFilterOptions } from './dto/subsection-filter-option';
import { UpdateSubsectionDto } from './dto/update-subsection.dto';

@Controller('subsections')
@ApiTags('Subsections')
@ApiExtraModels(Subsection)
@ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
export class SubsectionController {
    constructor(private readonly subsectionService: SubsectionService) {}

    @Post()
    @CreatedResponse(Subsection)
    @Auth(Roles.DBI_ADMIN)
    async createSubsection(
        @Body() createSubsectionDto: CreateSubsectionDto,
    ): Promise<GenericResponse<Subsection>> {
        const results = await this.subsectionService.create(
            createSubsectionDto,
        );
        return {
            message: 'Subsection created successfully',
            results,
        };
    }

    @Get()
    @Paginated()
    @PageResponse(Subsection)
    async findAll(
        @PaginationParams() options: IPagination,
        @Query() filterOptions: SubsectionFilterOptions,
    ): Promise<GenericResponse<IPage<Subsection>>> {
        const results = await this.subsectionService.findAll(
            options,
            filterOptions,
        );
        return {
            message: 'Subsections retrieved successfully',
            results,
        };
    }

    @Get('/:id')
    @OkResponse(Subsection)
    async findById(
        @Param('id') id: number,
    ): Promise<GenericResponse<Subsection>> {
        if (!id) {
            throw new BadRequestException('Subsection ID is required');
        }

        const results = await this.subsectionService.findById(id);
        return { message: 'Subsection retrieved successfully', results };
    }

    @Put('/:id')
    @OkResponse(Subsection)
    async update(
        @Param('id') id: number,
        @Body() updateSubsectionDto: UpdateSubsectionDto,
    ): Promise<GenericResponse<Subsection>> {
        if (!id) {
            throw new BadRequestException('Subsection ID is required');
        }

        const results = await this.subsectionService.update(
            id,
            updateSubsectionDto,
        );
        return { message: 'Subsection updated successfully', results };
    }
}
