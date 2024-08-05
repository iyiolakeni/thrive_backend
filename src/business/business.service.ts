import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from 'src/entities/business.entity/business.entity';
import { User } from 'src/entities/user.entity/user.entity';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto/update-business.dto';

@Injectable()
export class BusinessService {
    constructor(
        @InjectRepository(Business)
        private businessRepo: Repository<Business>
    ){}

    async create(createBusinessDto: CreateBusinessDto): Promise<Business>{
        const existingBusiness = await this.businessRepo.findOne({
            where: {businessName: createBusinessDto.businessName}
        });

        if (existingBusiness){
            throw new ConflictException('Business Already Exist, try another user or reset password');
        }
        const business = this.businessRepo.create(createBusinessDto);
        return this.businessRepo.save(business);
    }

    getAllBusiness(): Promise<Business[]>{
        return this.businessRepo.find();
    }

    getBusiness(businessName: string): Promise<Business>{
        return this.businessRepo.findOneBy({businessName})
    }

    async updateBusiness(name: string, updateBusinessdto: UpdateBusinessDto): Promise<Business>{
        // await this.businessRepo.update(name, updateBusinessdto);
        // return this.businessRepo.findOneBy({}) 
        const business = await this.businessRepo.findOne({where:{businessName: name}});
        if (!business){
            throw new NotFoundException(`Business with name ${name} not found`);
        }
        Object.assign(business, updateBusinessdto);
        return this.businessRepo.save(business);
    }

    async deleteBusiness(businessName: string): Promise<void>{
        await  this.businessRepo.delete(businessName);
    }
}
