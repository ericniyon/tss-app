import {
    BadRequestException,
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
import { CreateSectionDto } from './dto/create-section.dto';
import { SectionFilterOptionsDto } from './dto/section-filter-options.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entities/section.entity';

@Injectable()
export class SectionService {
    constructor(
        @InjectRepository(Section)
        private readonly sectionRepo: Repository<Section>,
    ) {}

    /**
     * @Service create a section
     * @param createSectionDto section creation body
     * @returns Section
     */
    async create(createSectionDto: CreateSectionDto): Promise<Section> {
        return this.sectionRepo.save({ ...createSectionDto });
    }
    /**
     * @Service get all sections
     * @returns list of sections
     */
    async findAll(
        options: IPagination,
        { sort, ...filterOptions }: SectionFilterOptionsDto,
        user: User,
    ): Promise<IPage<Section>> {
        let { status } = filterOptions;
        if (
            !status &&
            ![Roles.DBI_ADMIN, Roles.DBI_EXPERT].includes(user.role)
        ) {
            status = EStatus.ACTIVE;
        }
        const queryBuilder = this.sectionRepo.createQueryBuilder('s');
        const { actualStartDate, actualEndDate } = getActualDateRange(
            filterOptions.dateFrom,
            filterOptions.dateTo,
        );
        if (actualStartDate) {
            queryBuilder.andWhere(
                's.createdAt BETWEEN :actualStartDate AND :actualEndDate',
                {
                    actualStartDate,
                    actualEndDate,
                },
            );
        }

        if (status) {
            if (status == EStatus.ACTIVE)
                queryBuilder.where('s.active = :active', {
                    active: true,
                });
            if (status == EStatus.INACTIVE)
                queryBuilder.andWhere('s.active = :active', {
                    active: false,
                });
        }
        if (filterOptions.subcategoryId && !isNaN(filterOptions.subcategoryId)) {
            queryBuilder.andWhere('s.subcategoryId = :subcategoryId', {
                subcategoryId: filterOptions.subcategoryId,
            });
        }
        if (sort) {
            queryBuilder.orderBy(
                sort.split('__')[0] === 'NAME' ? 's.title' : 's.createdAt',
                sort.split('__')[1] === 'ASC' ? 'ASC' : 'DESC',
            );
        }
        const { items, meta } = await paginate(queryBuilder, options);
        return { items, ...meta };
    }
    /**
     * @Service find one section
     * @param id of a section
     * @returns a Section
     */
    async findOne(id: number): Promise<Section> {
        const section = await this.sectionRepo.findOne(id);
        if (!section) throw new NotFoundException('Section not found');
        return section;
    }

    /**
     * @Service update one section
     * @param id of a section
     * @returns updated Section
     */
    async update(
        id: number,
        updateSectionDto: UpdateSectionDto,
    ): Promise<Section> {
        let section = await this.findOne(id);
        // if (
        //     await this.sectionRepo.findOne({
        //         where: {
        //             id: Not(section.id),
        //             title: ILike(updateSectionDto?.title),
        //         },
        //     })
        // )
        //     throw new ConflictException(
        //         'Section with the same name already exists n',
        //     );
        section = { ...section, ...updateSectionDto };
        return await this.sectionRepo.save(section);
    }

    /**
     * Toggle active status
     * @param id of the section
     */
    async toggleActive(id: number): Promise<Section> {
        const section = await this.findOne(id);
        if (section.readonly)
            throw new BadRequestException('You cannot disable this section');
        section.active = !section.active;
        const result = await this.sectionRepo.save(section);
        return result;
    }

    // To be used later
    /**
     * @Service delete one section
     * @param id of a section
     */
    async delete(id: number): Promise<void> {
        await this.findOne(id);
        this.sectionRepo.softDelete({ id });
    }
}
