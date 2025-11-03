import { Subcategory } from './entities/subcategory.entity';
import { SubcategoryService } from './subcategory.service';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoryFilterOptions } from './dto/subcategory-filter-options';
export declare class SubcategoryController {
    private readonly subcategoryService;
    constructor(subcategoryService: SubcategoryService);
    createSubcategory(createSubcategoryDto: CreateSubcategoryDto): Promise<GenericResponse<Subcategory>>;
    findAll(options: IPagination, filterOptions: SubcategoryFilterOptions): Promise<GenericResponse<IPage<Subcategory>>>;
    findById(id: number): Promise<GenericResponse<Subcategory>>;
    update(id: number, updateSubcategoryDto: UpdateSubcategoryDto): Promise<GenericResponse<Subcategory>>;
    delete(id: number): Promise<GenericResponse<Subcategory>>;
}
