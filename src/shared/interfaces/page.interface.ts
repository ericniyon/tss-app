export interface IPage<T = any> {
    items: T[];
    totalItems?: number;
    itemCount?: number;
    itemsPerPage?: number;
    totalPages?: number;
    currentPage?: number;
}

export interface IPagination {
    page: number;
    limit: number;
}
