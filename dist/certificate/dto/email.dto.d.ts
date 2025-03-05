import { Certificate } from '../entities/certificate.entity';
export declare class EmailDto {
    certificates: Certificate[];
    message: string;
    subject: string;
}
