import { Body, ConflictException, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto/create-business.dto';
import { Business } from 'src/entities/business.entity/business.entity';
import { UpdateBusinessDto } from './dto/update-business.dto/update-business.dto';

@Controller('Business')
@ApiTags('Business Details')
export class BusinessController {
    constructor(
        private readonly businessService: BusinessService
    ){}

    @Post()
    async create(@Body() createbusinessDto: CreateBusinessDto): Promise<Business>{
        try{
            return this.businessService.create(createbusinessDto);
        }
        catch(error){
            if(error instanceof ConflictException){
                throw new HttpException('Business Already Exist, try another or reset details', HttpStatus.CONFLICT);
            }
            throw error;
        }
    }

    @Get()
    getAllBusiness(): Promise<Business[]>{
        return this.businessService.getAllBusiness();
    }

    @Get(':businessName')
    async getBusinessDetails(@Param('businessName') businessName:string): Promise<Business>{
        return this.businessService.getBusiness(businessName);
    }

    @Patch(':businessName')
    async updateBusiness(@Param('businessName') businessName:string, @Body() updateBusinessDto: UpdateBusinessDto): Promise<Business>{
        return this.businessService.updateBusiness(businessName, updateBusinessDto)
    }

    @Delete(':businessName')
    async deleteBusiness(@Param('businessName') businessName:string): Promise<void>{
        return this.businessService.deleteBusiness(businessName);
    }
}
