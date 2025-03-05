import { OptionalProperty } from 'src/shared/decorators';
import { CommonFilterOptionsDto } from 'src/shared/dto/common-filter-options.dto';

export class SubsectionFilterOptions extends CommonFilterOptionsDto {
    @OptionalProperty()
    name?: string;
}
