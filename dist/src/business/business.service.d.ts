import { Business } from "src/entities/business.entity/business.entity";
import { Repository } from "typeorm";
import { CreateBusinessDto } from "./dto/create-business.dto/create-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto/update-business.dto";
import { SharedService } from "src/shared-service/shared-service.service";
import { DataResponse, InvalidCredentialsResponse, NotFoundResponse, SuccessResponse } from "src/models/response.dto";
export declare class BusinessService {
    private businessRepo;
    private sharedService;
    private readonly logger;
    private readonly paystackUrl;
    private readonly headers;
    constructor(businessRepo: Repository<Business>, sharedService: SharedService);
    create(createBusinessDto: CreateBusinessDto): Promise<SuccessResponse | NotFoundResponse | InvalidCredentialsResponse>;
    getAllBusiness(): Promise<DataResponse<Business[]>>;
    getBusiness(name: string): Promise<DataResponse<Business> | NotFoundResponse>;
    getAllBanks(): Promise<DataResponse<any> | NotFoundResponse>;
    updateBusiness(name: string, updateBusinessdto: UpdateBusinessDto): Promise<Business>;
    deleteBusiness(businessName: string): Promise<void>;
    verifyBusiness(id: string): Promise<SuccessResponse | NotFoundResponse>;
    activateBusiness(id: string): Promise<SuccessResponse | NotFoundResponse>;
    deactivateBusiness(id: string): Promise<SuccessResponse | NotFoundResponse>;
    verifyAccount(accountNumber: string, bankCode: string): Promise<DataResponse<any> | NotFoundResponse>;
    createSubAccount(business_name: string, bank_code: string, account_number: string, primary_contact_email: string): Promise<DataResponse<any> | InvalidCredentialsResponse | NotFoundResponse>;
}
//# sourceMappingURL=business.service.d.ts.map