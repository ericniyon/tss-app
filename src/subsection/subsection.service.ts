import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Not, Repository } from 'typeorm/index.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Subsection } from './entities/subsection.entity';
import { CreateSubsectionDto } from './dto/create-subsection.dto';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { SubsectionFilterOptions } from './dto/subsection-filter-option';
import { paginate } from 'nestjs-typeorm-paginate';
import { UpdateSubsectionDto } from './dto/update-subsection.dto';

@Injectable()
export class SubsectionService {
    constructor(
        @InjectRepository(Subsection)
        private readonly subsectionRepo: Repository<Subsection>,
    ) {}

    /**
     * @Service create a subsection
     * @param createSubsectionDto subsection creation body
     * @returns Subsection
     */
    async create(
        createSubsectionDto: CreateSubsectionDto,
    ): Promise<Subsection> {
        if (
            await this.subsectionRepo.count({
                name: createSubsectionDto.name,
            })
        ) {
            throw new ConflictException(
                'Subsection with the same name already exists',
            );
        }

        return this.subsectionRepo.save({ ...createSubsectionDto });
    }

    /**
     * @Service get all subsections
     * @returns list of subsections
     */
    async findAll(
        options: IPagination,
        filterOptions: SubsectionFilterOptions,
    ): Promise<IPage<Subsection>> {
        const queryBuilder =
            this.subsectionRepo.createQueryBuilder('subsections');
        if (filterOptions.name) {
            queryBuilder.where('subsections.name ILIKE :name', {
                name: `%${filterOptions.name}%`,
            });
        }

        // join with section
        queryBuilder.leftJoinAndSelect('subsections.section', 'section');
        queryBuilder.orderBy('subsections.createdAt', 'DESC');

        const { items, meta } = await paginate(queryBuilder, options);

        return { items, ...meta };
    }

    /**
     * @Service find a subsection by ID
     * @param id subsection ID
     * @returns Subsection
     */
    async findById(id: number): Promise<Subsection> {
        const subsection = await this.subsectionRepo.findOne(id);
        if (!subsection) {
            throw new NotFoundException(`Subsection with ID ${id} not found`);
        }
        return subsection;
    }

    /**
     * @Service update a subsection by ID
     * @param id subsection ID
     * @param updateSubsectionDto subsection update body
     * @returns Subsection
     */
    async update(
        id: number,
        updateSubsectionDto: UpdateSubsectionDto,
    ): Promise<Subsection> {
        // Check if the new subsection name already exists
        if (
            await this.subsectionRepo.count({
                name: updateSubsectionDto.name,
                id: Not(id),
            })
        ) {
            throw new ConflictException(
                'Subsection with the same name already exists',
            );
        }

        const subsection = await this.findById(id);
        if (!subsection) {
            throw new NotFoundException(`Subsection with ID ${id} not found`);
        }

        Object.assign(subsection, updateSubsectionDto);
        return this.subsectionRepo.save(subsection);
    }
}
