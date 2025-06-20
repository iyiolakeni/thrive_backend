import { BusinessService } from "./business.service";
import { CreateBusinessDto } from "./dto/create-business.dto/create-business.dto";
import { Business } from "src/entities/business.entity/business.entity";
import { UpdateBusinessDto } from "./dto/update-business.dto/update-business.dto";
import { DataResponse, InvalidCredentialsResponse, NotFoundResponse, SuccessResponse } from "src/models/response.dto";
export declare class BusinessController {
    private readonly businessService;
    constructor(businessService: BusinessService);
    create(createbusinessDto: CreateBusinessDto): Promise<SuccessResponse | NotFoundResponse | InvalidCredentialsResponse>;
    getAllBusiness(): Promise<DataResponse<Business[]>>;
    getBusinessDetails(businessName: string): Promise<DataResponse<Business> | NotFoundResponse>;
    updateBusiness(businessName: string, updateBusinessDto: UpdateBusinessDto): Promise<Business>;
    deleteBusiness(businessName: string): Promise<void>;
    verifyBusiness(id: string): Promise<SuccessResponse | NotFoundResponse>;
    activateBusiness(id: string): Promise<SuccessResponse | NotFoundResponse>;
    deactivateBusiness(id: string): Promise<SuccessResponse | NotFoundResponse>;
    getAllBanks(): Promise<DataResponse<any> | NotFoundResponse>;
}
//# sourceMappingURL=business.controller.d.ts.map