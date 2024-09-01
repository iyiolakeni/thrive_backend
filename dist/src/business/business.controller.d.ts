import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto/create-business.dto';
import { Business } from 'src/entities/business.entity/business.entity';
import { UpdateBusinessDto } from './dto/update-business.dto/update-business.dto';
export declare class BusinessController {
    private readonly businessService;
    constructor(businessService: BusinessService);
    create(createbusinessDto: CreateBusinessDto): Promise<Business>;
    getAllBusiness(): Promise<Business[]>;
    getBusinessDetails(businessName: string): Promise<Business>;
    updateBusiness(businessName: string, updateBusinessDto: UpdateBusinessDto): Promise<Business>;
    deleteBusiness(businessName: string): Promise<void>;
}
//# sourceMappingURL=business.controller.d.ts.map