import { GenericResponse } from '../shared/interfaces/generic-response.interface';
import { IPage, IPagination } from '../shared/interfaces/page.interface';
import { User } from '../users/entities/user.entity';
import { CertificateService } from './certificate.service';
import { CertificateFilterOptionsDto } from './dto/certificate-filter-options.dto';
import { UpdateCertificateStatusDto } from './dto/update-certificate-status.dto';
import { Certificate } from './entities/certificate.entity';
export declare class CertificateController {
    private readonly certificateService;
    constructor(certificateService: CertificateService);
    findAll(user: User, options: IPagination, filterOptions: CertificateFilterOptionsDto): Promise<GenericResponse<IPage<Certificate>>>;
    findOne(uniqueId: string): Promise<GenericResponse<Certificate>>;
    updateStatus(uniqueId: string, updateStatusDto: UpdateCertificateStatusDto): Promise<GenericResponse<Certificate>>;
    renew(uniqueId: string): Promise<GenericResponse<Certificate>>;
    renewing(uniqueId: string): Promise<GenericResponse<Certificate>>;
    applicantCertificateByName(name: string): Promise<GenericResponse<Certificate>>;
    applicantCertificateByLoggedIn(user: User): Promise<GenericResponse<Certificate>>;
    updateMultCerticatesStatus(UpdateStatusDto: UpdateCertificateStatusDto): Promise<GenericResponse<Certificate>>;
}
