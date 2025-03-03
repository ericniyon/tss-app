import {
    Body,
    Controller,
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
import {
    CreatedResponse,
    ErrorResponses,
    ForbiddenResponse,
    NotFoundResponse,
    OkResponse,
    PageResponse,
    Paginated,
    PaginationParams,
    UnauthorizedResponse,
} from '../shared/decorators';
import { Roles } from '../shared/enums/roles.enum';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { User } from '../users/entities/user.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { SectionFilterOptionsDto } from './dto/section-filter-options.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entities/section.entity';
import { SectionService } from './section.service';

@Controller('sections')
@Auth()
@ApiTags('Sections')
@ApiExtraModels(Section)
@ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
export class SectionController {
    constructor(private readonly sectionService: SectionService) {}

    @Post()
    @CreatedResponse(Section)
    @Auth(Roles.DBI_ADMIN)
    async createSection(
        @Body() createSectionDto: CreateSectionDto,
    ): Promise<GenericResponse<Section>> {
        const results = await this.sectionService.create(createSectionDto);
        return {
            message: 'Section created successfully',
            results,
        };
    }

    @Get()
    @Paginated()
    @PageResponse(Section)
    async findAll(
        @PaginationParams() options: IPagination,
        @Query() filterOptions: SectionFilterOptionsDto,
        @GetUser() user: User,
    ): Promise<GenericResponse<IPage<Section>>> {
        const results = await this.sectionService.findAll(
            options,
            filterOptions,
            user,
        );
        return {
            message: 'Sections retrieved successfully',
            results,
        };
    }

    @Get('/:id')
    @OkResponse(Section)
    async findOne(
        @Param('id', ParseIntPipe) id: string,
    ): Promise<GenericResponse<Section>> {
        const results = await this.sectionService.findOne(+id);
        return {
            message: 'Section retrieved successfully',
            results,
        };
    }

    @Put('/:id')
    @OkResponse(Section)
    @Auth(Roles.DBI_ADMIN)
    async update(
        @Param('id', ParseIntPipe) id: string,
        @Body() updateSectionDto: UpdateSectionDto,
    ): Promise<GenericResponse<Section>> {
        const results = await this.sectionService.update(+id, updateSectionDto);
        return {
            message: 'Section updated successfully',
            results,
        };
    }

    @Patch(':id/toggle-active')
    @OkResponse()
    @ErrorResponses(NotFoundResponse)
    @Auth(Roles.DBI_ADMIN)
    async toggleActive(
        @Param('id', ParseIntPipe) id: string,
    ): Promise<GenericResponse<void>> {
        const result = await this.sectionService.toggleActive(+id);
        return {
            message: `Section with title "${result.title}" ${
                result.active ? 'activated' : 'deactivated'
            }`,
        };
    }

    // @Delete('/:id')
    // @OkResponse()
    // @Auth(Roles.DBI_ADMIN)
    // async delete(
    //     @Param('id', ParseIntPipe) id: string,
    // ): Promise<GenericResponse<null>> {
    //     await this.sectionService.delete(+id);
    //     return {
    //         message: `Section with id[${id}] deleted`,
    //     };
    // }
}
