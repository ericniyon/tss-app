import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { User } from '../users/entities/user.entity';
import { CategoryService } from './category.service';
import { CategoryFilterOptionsDto } from './dto/category-filter-options.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createCategoryDto: CreateCategoryDto): Promise<GenericResponse<Category>>;
    findAll(user: User, options: IPagination, filterOptions: CategoryFilterOptionsDto): Promise<GenericResponse<IPage<Category>>>;
    findOne(id: string): Promise<GenericResponse<Category>>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<GenericResponse<Category>>;
    remove(id: string): Promise<GenericResponse<void>>;
    toggleActive(id: string): Promise<GenericResponse<void>>;
}
