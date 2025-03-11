import { Subsection } from './entities/subsection.entity';
import { SubsectionService } from './subsection.service';
import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { CreateSubsectionDto } from './dto/create-subsection.dto';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { SubsectionFilterOptions } from './dto/subsection-filter-option';
import { UpdateSubsectionDto } from './dto/update-subsection.dto';
export declare class SubsectionController {
    private readonly subsectionService;
    constructor(subsectionService: SubsectionService);
    createSubsection(createSubsectionDto: CreateSubsectionDto): Promise<GenericResponse<Subsection>>;
    findAll(options: IPagination, filterOptions: SubsectionFilterOptions): Promise<GenericResponse<IPage<Subsection>>>;
    findById(id: number): Promise<GenericResponse<Subsection>>;
    update(id: number, updateSubsectionDto: UpdateSubsectionDto): Promise<GenericResponse<Subsection>>;
}
