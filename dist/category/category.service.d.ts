import { Repository } from 'typeorm';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { User } from '../users/entities/user.entity';
import { CategoryFilterOptionsDto } from './dto/category-filter-options.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
export declare class CategoryService {
    private readonly categoryRepo;
    constructor(categoryRepo: Repository<Category>);
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAll(options: IPagination, { sort, search, ...filterOptions }: CategoryFilterOptionsDto, user: User): Promise<IPage<Category>>;
    findOne(id: number): Promise<Category>;
    update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    remove(id: number): Promise<void>;
    toggleActive(id: number): Promise<Category>;
}
