import { Transform } from 'class-transformer';
import { IsArray } from 'class-validator';
import { OptionalProperty } from '../../shared/decorators';
import { CommonFilterOptionsDto } from '../../shared/dto/common-filter-options.dto';
import { ECertificateStatus } from '../enums';

export class CertificateFilterOptionsDto extends CommonFilterOptionsDto {
    @OptionalProperty({ enum: ECertificateStatus })
    status?: ECertificateStatus;
    @OptionalProperty({ example: '1,2' })
    @Transform(({ value }: { value: string }) =>
        value === '' ? null : value?.split(','),
    )
    @IsArray()
    categories?: string;
    @OptionalProperty()
    assignee?: number;
}
