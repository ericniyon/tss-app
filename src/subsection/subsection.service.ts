import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm/index.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Subsection } from './entities/subsection.entity';
import { CreateSubsectionDto } from './dto/create-subsection.dto';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { SubsectionFilterOptions } from './dto/subsection-filter-option';
import { paginate } from 'nestjs-typeorm-paginate';
import { UpdateSubsectionDto } from './dto/update-subsection.dto';
import { Section } from '../section/entities/section.entity';

@Injectable()
export class SubsectionService {
    constructor(
        @InjectRepository(Subsection)
        private readonly subsectionRepo: Repository<Subsection>,
        @InjectRepository(Section)
        private readonly sectionRepo: Repository<Section>,
    ) {}

    /**
     * @Service create a subsection
     * @param createSubsectionDto subsection creation body
     * @returns Subsection
     */
    async create(
        createSubsectionDto: CreateSubsectionDto,
    ): Promise<Subsection> {
        // Load and validate the section exists
        const section = await this.sectionRepo.findOne({
            id: createSubsectionDto.section,
        });
        if (!section) {
            throw new NotFoundException(
                `Section with ID ${createSubsectionDto.section} not found`,
            );
        }

        // Check if subsection with same name already exists in this section
        const existingSubsection = await this.subsectionRepo
            .createQueryBuilder('subsection')
            .where('subsection.name = :name', { name: createSubsectionDto.name })
            .andWhere('subsection.section = :sectionId', {
                sectionId: createSubsectionDto.section,
            })
            .getOne();

        if (existingSubsection) {
            throw new ConflictException(
                'Subsection with the same name already exists in this section',
            );
        }

        const subsection = new Subsection();
        subsection.name = createSubsectionDto.name;
        subsection.section = section;

        return this.subsectionRepo.save(subsection);
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
        const subsection = await this.subsectionRepo.findOne(id, {
            relations: ['section'],
        });
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
        const subsection = await this.findById(id);
        if (!subsection) {
            throw new NotFoundException(`Subsection with ID ${id} not found`);
        }

        // If section is being updated, validate it exists
        let section = subsection.section;
        if (updateSubsectionDto.section) {
            section = await this.sectionRepo.findOne({
                id: updateSubsectionDto.section,
            });
            if (!section) {
                throw new NotFoundException(
                    `Section with ID ${updateSubsectionDto.section} not found`,
                );
            }
        }

        // If name is being updated, check uniqueness within the section
        const sectionId = updateSubsectionDto.section || subsection.section.id;
        if (updateSubsectionDto.name) {
            const existingSubsection = await this.subsectionRepo
                .createQueryBuilder('subsection')
                .where('subsection.name = :name', { name: updateSubsectionDto.name })
                .andWhere('subsection.section = :sectionId', { sectionId })
                .andWhere('subsection.id != :id', { id })
                .getOne();

            if (existingSubsection) {
                throw new ConflictException(
                    'Subsection with the same name already exists in this section',
                );
            }
        }

        // Update subsection properties
        if (updateSubsectionDto.name) {
            subsection.name = updateSubsectionDto.name;
        }
        if (updateSubsectionDto.section) {
            subsection.section = section;
        }

        return this.subsectionRepo.save(subsection);
    }

    /**
     * @Service delete a subsection by ID
     * @param id subsection ID
     */
    async delete(id: number): Promise<void> {
        const subsection = await this.findById(id);
        if (!subsection) {
            throw new NotFoundException(`Subsection with ID ${id} not found`);
        }
        await this.subsectionRepo.softDelete(subsection.id);
    }
}
