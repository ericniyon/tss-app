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
import { CategoryService } from './category.service';
import { CategoryFilterOptionsDto } from './dto/category-filter-options.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

/**
 * @Controller Category endpoints
 */
@Controller('categories')
@ApiTags('Categories')
@ApiExtraModels(Category)
@Auth()
@ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @Auth(Roles.DBI_ADMIN)
    @CreatedResponse(Category)
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
    ): Promise<GenericResponse<Category>> {
        return {
            message: 'Category created successfully',
            results: await this.categoryService.create(createCategoryDto),
        };
    }

    @Get()
    @Paginated()
    @PageResponse(Category)
    async findAll(
        @GetUser() user: User,
        @PaginationParams() options: IPagination,
        @Query() filterOptions: CategoryFilterOptionsDto,
    ): Promise<GenericResponse<IPage<Category>>> {
        return {
            message: 'Categories retrieved',
            results: await this.categoryService.findAll(
                options,
                filterOptions,
                user,
            ),
        };
    }

    @Get(':id')
    @OkResponse(Category)
    @ErrorResponses(NotFoundResponse)
    async findOne(@Param('id') id: string): Promise<GenericResponse<Category>> {
        return {
            message: 'Category retrieved successfully',
            results: await this.categoryService.findOne(+id),
        };
    }

    @Put(':id')
    @Auth(Roles.DBI_ADMIN)
    @OkResponse(Category)
    @ErrorResponses(NotFoundResponse)
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ): Promise<GenericResponse<Category>> {
        return {
            message: 'Category updated successfully',
            results: await this.categoryService.update(+id, updateCategoryDto),
        };
    }

    @Delete(':id')
    @Auth(Roles.DBI_ADMIN)
    @OkResponse()
    @ErrorResponses(NotFoundResponse)
    async remove(
        @Param('id', ParseIntPipe) id: string,
    ): Promise<GenericResponse<void>> {
        await this.categoryService.remove(+id);
        return {
            message: `Category with id[${id}] deleted`,
        };
    }

    @Patch(':id/toggle-active')
    @Auth(Roles.DBI_ADMIN)
    @OkResponse()
    @ErrorResponses(NotFoundResponse)
    async toggleActive(
        @Param('id', ParseIntPipe) id: string,
    ): Promise<GenericResponse<void>> {
        const result = await this.categoryService.toggleActive(+id);
        return {
            message: `Category with name "${result.name}" ${
                result.active ? 'activated' : 'deactivated'
            }`,
        };
    }
}
