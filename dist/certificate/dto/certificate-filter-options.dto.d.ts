import { CommonFilterOptionsDto } from '../../shared/dto/common-filter-options.dto';
import { ECertificateStatus } from '../enums';
export declare class CertificateFilterOptionsDto extends CommonFilterOptionsDto {
    status?: ECertificateStatus;
    categories?: string;
    assignee?: number;
}
