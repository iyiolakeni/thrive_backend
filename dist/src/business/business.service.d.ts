import { Business } from 'src/entities/business.entity/business.entity';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto/update-business.dto';
export declare class BusinessService {
    private businessRepo;
    constructor(businessRepo: Repository<Business>);
    create(createBusinessDto: CreateBusinessDto): Promise<Business>;
    getAllBusiness(): Promise<Business[]>;
    getBusiness(businessName: string): Promise<Business>;
    updateBusiness(name: string, updateBusinessdto: UpdateBusinessDto): Promise<Business>;
    deleteBusiness(businessName: string): Promise<void>;
}
//# sourceMappingURL=business.service.d.ts.map