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
import { Subcategory } from './entities/subcategory.entity';
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
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/shared/enums/roles.enum';
import { SubcategoryService } from './subcategory.service';
import { GenericResponse } from 'src/shared/interfaces/generic-response.interface';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { IPage, IPagination } from 'src/shared/interfaces/page.interface';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoryFilterOptions } from './dto/subcategory-filter-options';

@Controller('subcategories')
@Auth()
@ApiTags('Subcategories')
@ApiExtraModels(Subcategory)
@ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
export class SubcategoryController {
    constructor(private readonly subcategoryService: SubcategoryService) {}

    @Post()
    @CreatedResponse(Subcategory)
    @Auth(Roles.DBI_ADMIN)
    async createSubcategory(
        @Body() createSubcategoryDto: CreateSubcategoryDto,
    ): Promise<GenericResponse<Subcategory>> {
        const results = await this.subcategoryService.create(
            createSubcategoryDto,
        );
        return {
            message: 'Subcategory created successfully',
            results,
        };
    }

    @Get()
    @Paginated()
    @PageResponse(Subcategory)
    async findAll(
        @PaginationParams() options: IPagination,
        @Query() filterOptions: SubcategoryFilterOptions,
    ): Promise<GenericResponse<IPage<Subcategory>>> {
        const results = await this.subcategoryService.findAll(
            options,
            filterOptions,
        );
        return {
            message: 'Subcategory retrieved successfully',
            results,
        };
    }

    @Get('/:id')
    @OkResponse(Subcategory)
    async findById(
        @Param('id') id: number,
    ): Promise<GenericResponse<Subcategory>> {
        if (!id) {
            throw new BadRequestException('Subcategory ID is required');
        }
        const results = await this.subcategoryService.findById(id);
        return {
            message: 'Subcategory retrieved successfully',
            results,
        };
    }

    @Put('/:id')
    @OkResponse(Subcategory)
    @Auth(Roles.DBI_ADMIN)
    async update(
        @Param('id') id: number,
        @Body() updateSubcategoryDto: UpdateSubcategoryDto,
    ): Promise<GenericResponse<Subcategory>> {
        const results = await this.subcategoryService.update(
            id,
            updateSubcategoryDto,
        );
        return {
            message: 'Subcategory updated successfully',
            results,
        };
    }
}
