import { EStatus } from '../../question/enums';
import { OptionalProperty } from '../../shared/decorators';
import { CommonFilterOptionsDto } from '../../shared/dto/common-filter-options.dto';

export class CategoryFilterOptionsDto extends CommonFilterOptionsDto {
    @OptionalProperty({ enum: EStatus })
    status?: EStatus;
}
