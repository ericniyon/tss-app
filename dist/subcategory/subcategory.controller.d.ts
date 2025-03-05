import { Subcategory } from './entities/subcategory.entity';
import { SubcategoryService } from './subcategory.service';
import { GenericResponse } from 'src/shared/interfaces/generic-response.interface';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { IPage, IPagination } from 'src/shared/interfaces/page.interface';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoryFilterOptions } from './dto/subcategory-filter-options';
export declare class SubcategoryController {
    private readonly subcategoryService;
    constructor(subcategoryService: SubcategoryService);
    createSubcategory(createSubcategoryDto: CreateSubcategoryDto): Promise<GenericResponse<Subcategory>>;
    findAll(options: IPagination, filterOptions: SubcategoryFilterOptions): Promise<GenericResponse<IPage<Subcategory>>>;
    findById(id: number): Promise<GenericResponse<Subcategory>>;
    update(id: number, updateSubcategoryDto: UpdateSubcategoryDto): Promise<GenericResponse<Subcategory>>;
}
