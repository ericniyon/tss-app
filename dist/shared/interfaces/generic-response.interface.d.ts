export interface GenericResponse<T> {
    message: string;
    results?: T;
}
