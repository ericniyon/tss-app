import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { ILike, Not, Repository } from 'typeorm';
import { EStatus } from '../question/enums';
import { Roles } from '../shared/enums/roles.enum';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { getActualDateRange } from '../shared/utils/date.util';
import { User } from '../users/entities/user.entity';
import { CategoryFilterOptionsDto } from './dto/category-filter-options.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

/**
 * @Service Category operations
 */
@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) {}

    /**
     * Create new category
     * @param createCategoryDto category body
     * @returns new category
     */
    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        if (await this.categoryRepo.findOne({ name: createCategoryDto.name }))
            throw new ConflictException(
                'Category with the same name already exists',
            );
        return await this.categoryRepo.save({ ...createCategoryDto });
    }

    /**
     *
     * @returns all categories
     */
    async findAll(
        options: IPagination,
        { sort, search, ...filterOptions }: CategoryFilterOptionsDto,
        user: User,
    ): Promise<IPage<Category>> {
        const queryBuilder = this.categoryRepo.createQueryBuilder('c');
        const { actualStartDate, actualEndDate } = getActualDateRange(
            filterOptions.dateFrom,
            filterOptions.dateTo,
        );
        if (actualStartDate) {
            queryBuilder.andWhere(
                'c.createdAt BETWEEN :actualStartDate AND :actualEndDate',
                {
                    actualStartDate,
                    actualEndDate,
                },
            );
        }

        if (
            !filterOptions.status &&
            ![Roles.DBI_ADMIN, Roles.DBI_EXPERT].includes(user.role)
        ) {
            filterOptions.status = EStatus.ACTIVE;
        }
        if (filterOptions.status) {
            if (filterOptions.status == EStatus.ACTIVE)
                queryBuilder.where('c.active = :active', {
                    active: true,
                });
            if (filterOptions.status == EStatus.INACTIVE)
                queryBuilder.andWhere('c.active = :active', {
                    active: false,
                });
        }
        if (search) {
            queryBuilder.andWhere('c.name ILIKE :search', {
                search: `%${search}%`,
            });
        }
        if (sort) {
            queryBuilder.orderBy(
                sort.split('__')[0] === 'NAME' ? 'c.name' : 'c.createdAt',
                sort.split('__')[1] === 'ASC' ? 'ASC' : 'DESC',
            );
        }
        const { items, meta } = await paginate(queryBuilder, options);
        return { items, ...meta };
    }

    /**
     * Find one category
     * @param id of the category
     * @returns category
     */
    async findOne(id: number): Promise<Category> {
        return await this.categoryRepo.findOneOrFail(id).catch(() => {
            throw new NotFoundException('Category not found');
        });
    }

    /**
     * Update a category
     * @param id of the category
     * @param updateCategoryDto updated body
     * @returns updated category
     */
    async update(
        id: number,
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<Category> {
        let category = await this.findOne(id);
        if (
            await this.categoryRepo.findOne({
                where: {
                    id: Not(category.id),
                    name: ILike(updateCategoryDto?.name),
                },
            })
        )
            throw new ConflictException(
                'Category with the same name already exists',
            );
        category = { ...category, ...updateCategoryDto };
        return this.categoryRepo.save(category);
    }

    /**
     * Remove a category
     * @param id of the category
     */
    async remove(id: number): Promise<void> {
        const category = await this.findOne(id);
        this.categoryRepo.softDelete(category.id);
    }

    /**
     * Toggle active status
     * @param id of the category
     */
    async toggleActive(id: number): Promise<Category> {
        const category = await this.findOne(id);
        category.active = !category.active;
        const result = await this.categoryRepo.save(category);
        return result;
    }
}
