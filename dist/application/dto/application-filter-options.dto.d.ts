import { CommonFilterOptionsDto } from '../../shared/dto/common-filter-options.dto';
import { EApplicationStatus } from '../enums';
export declare class ApplicationFilterOptionsDto extends CommonFilterOptionsDto {
    status?: EApplicationStatus;
    categories?: string;
    assignee?: number;
}
