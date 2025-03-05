import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { User } from '../users/entities/user.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { SectionFilterOptionsDto } from './dto/section-filter-options.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entities/section.entity';
import { SectionService } from './section.service';
export declare class SectionController {
    private readonly sectionService;
    constructor(sectionService: SectionService);
    createSection(createSectionDto: CreateSectionDto): Promise<GenericResponse<Section>>;
    findAll(options: IPagination, filterOptions: SectionFilterOptionsDto, user: User): Promise<GenericResponse<IPage<Section>>>;
    findOne(id: string): Promise<GenericResponse<Section>>;
    update(id: string, updateSectionDto: UpdateSectionDto): Promise<GenericResponse<Section>>;
    toggleActive(id: string): Promise<GenericResponse<void>>;
}
