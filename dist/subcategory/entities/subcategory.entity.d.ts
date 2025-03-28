import BaseEntity from '../../shared/interfaces/base.entity';
import { Category } from '../../category/entities/category.entity';
export declare class Subcategory extends BaseEntity {
    name: string;
    active: boolean;
    category: Category;
}
