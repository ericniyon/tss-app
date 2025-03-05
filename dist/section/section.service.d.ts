import { Repository } from 'typeorm';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { User } from '../users/entities/user.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { SectionFilterOptionsDto } from './dto/section-filter-options.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entities/section.entity';
export declare class SectionService {
    private readonly sectionRepo;
    constructor(sectionRepo: Repository<Section>);
    create(createSectionDto: CreateSectionDto): Promise<Section>;
    findAll(options: IPagination, { sort, ...filterOptions }: SectionFilterOptionsDto, user: User): Promise<IPage<Section>>;
    findOne(id: number): Promise<Section>;
    update(id: number, updateSectionDto: UpdateSectionDto): Promise<Section>;
    toggleActive(id: number): Promise<Section>;
    delete(id: number): Promise<void>;
}
