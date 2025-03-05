import { Roles } from '../../shared/enums/roles.enum';
export declare function Auth(...roles: Roles[]): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
