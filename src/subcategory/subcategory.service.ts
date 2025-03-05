import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { Not, Repository } from 'typeorm';
import { IPage, IPagination } from 'src/shared/interfaces/page.interface';
import { paginate } from 'nestjs-typeorm-paginate';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoryFilterOptions } from './dto/subcategory-filter-options';
@Injectable()
export class SubcategoryService {
    constructor(
        @InjectRepository(Subcategory)
        private readonly subcategoryRepo: Repository<Subcategory>,
    ) {}

    /**
     * @Service create a subcategory
     * @param createSubcategoryDto subcategory creation body
     * @returns Subcategory
     */
    async create(createSubcategoryDto: any): Promise<Subcategory> {
        if (
            await this.subcategoryRepo.count({
                name: createSubcategoryDto.name,
            })
        )
            throw new ConflictException(
                'Subcategory with the same name already exists',
            );

        return this.subcategoryRepo.save({ ...createSubcategoryDto });
    }

    /**
     * @Service find a subcategory by ID
     * @param id subcategory ID
     * @returns Subcategory
     */
    async findById(id: number): Promise<Subcategory> {
        const subcategory = await this.subcategoryRepo.findOne(id);
        if (!subcategory) {
            throw new NotFoundException(`Subcategory with ID ${id} not found`);
        }
        return subcategory;
    }

    /**
     * @Service update a subcategory by ID
     * @param id subcategory ID
     * @param updateSubcategoryDto subcategory update body
     * @returns Subcategory
     */
    async update(
        id: number,
        updateSubcategoryDto: UpdateSubcategoryDto,
    ): Promise<Subcategory> {
        // Check if the new subcategory name already exists
        if (
            await this.subcategoryRepo.count({
                name: updateSubcategoryDto.name,
                id: Not(id),
            })
        ) {
            throw new ConflictException(
                'Subcategory with the same name already exists',
            );
        }

        const subcategory = await this.findById(id);
        if (!subcategory) {
            throw new NotFoundException(`Subcategory with ID ${id} not found`);
        }

        Object.assign(subcategory, updateSubcategoryDto);
        return this.subcategoryRepo.save(subcategory);
    }

    /**
     * @Service find all subcategories
     * @returns Subcategory[]
     */
    async findAll(
        options: IPagination,
        filterOptions: SubcategoryFilterOptions,
    ): Promise<IPage<Subcategory>> {
        const queryBuilder =
            this.subcategoryRepo.createQueryBuilder('subcategory');
        if (filterOptions.name) {
            queryBuilder.andWhere('subcategory.name ILIKE :name', {
                name: `%${filterOptions.name}%`,
            });
        }

        // join the category table
        queryBuilder.leftJoinAndSelect('subcategory.category', 'category');
        queryBuilder.orderBy('subcategory.createdAt', 'DESC');

        const { items, meta } = await paginate(queryBuilder, options);

        return { items, ...meta };
    }
}
