import { Repository } from 'typeorm/index.js';
import { Subsection } from './entities/subsection.entity';
import { CreateSubsectionDto } from './dto/create-subsection.dto';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { SubsectionFilterOptions } from './dto/subsection-filter-option';
import { UpdateSubsectionDto } from './dto/update-subsection.dto';
export declare class SubsectionService {
    private readonly subsectionRepo;
    constructor(subsectionRepo: Repository<Subsection>);
    create(createSubsectionDto: CreateSubsectionDto): Promise<Subsection>;
    findAll(options: IPagination, filterOptions: SubsectionFilterOptions): Promise<IPage<Subsection>>;
    findById(id: number): Promise<Subsection>;
    update(id: number, updateSubsectionDto: UpdateSubsectionDto): Promise<Subsection>;
}
