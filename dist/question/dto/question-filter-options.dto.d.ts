import { CommonFilterOptionsDto } from '../../shared/dto/common-filter-options.dto';
import { EStatus, EType } from '../enums';
export declare class QuestionFilterOptionsDto extends CommonFilterOptionsDto {
    status?: EStatus;
    categories?: string;
    section?: number;
    type?: EType;
}
