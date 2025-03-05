import { Subcategory } from './entities/subcategory.entity';
import { Repository } from 'typeorm';
import { IPage, IPagination } from 'src/shared/interfaces/page.interface';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoryFilterOptions } from './dto/subcategory-filter-options';
export declare class SubcategoryService {
    private readonly subcategoryRepo;
    constructor(subcategoryRepo: Repository<Subcategory>);
    create(createSubcategoryDto: any): Promise<Subcategory>;
    findById(id: number): Promise<Subcategory>;
    update(id: number, updateSubcategoryDto: UpdateSubcategoryDto): Promise<Subcategory>;
    findAll(options: IPagination, filterOptions: SubcategoryFilterOptions): Promise<IPage<Subcategory>>;
}
