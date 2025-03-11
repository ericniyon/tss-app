import { OptionalProperty } from '../../shared/decorators';
import { CommonFilterOptionsDto } from '../../shared/dto/common-filter-options.dto';

export class SubcategoryFilterOptions extends CommonFilterOptionsDto {
    @OptionalProperty()
    name?: string;
}
