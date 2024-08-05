import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>
    ){}

    async findOneByEmail(email: string): Promise<User | undefined>{
        return this.userRepo.findOneBy({email})
    }

    // async findOneByPhone(phoneNo: string): Promise<User | undefined>{
    //     return this.userRepo.findOne({where:{phoneNo}})
    // }

   async create(createUserDto: CreateUserDto): Promise<User>{
        const existingUser = await this.userRepo.findOne({
            where: {username: createUserDto.username}
        });

        if(existingUser){
            throw new ConflictException('Username already taken, kinldy try another username');
        }
        const user = this.userRepo.create(createUserDto);
        const salt = await bcrypt.genSalt();
        if (createUserDto.password){
            user.password = await bcrypt.hash(user.password, salt);
        }
        return this.userRepo.save(user);
    }

    getAllUsers(): Promise<User[]>{
        return this.userRepo.find();
    }

    getUser(username: string): Promise<User>{
        return this.userRepo.findOneBy({username});
    }

    async updateUser(username: string, updateuserDto: UpdateUserDto): Promise<User>{
        await this.userRepo.update(username, updateuserDto);
        return this.userRepo.findOneBy({username});
    }

    async deleteUser(username: string): Promise<void>{
        if(typeof username !== 'string' || username.trim() === ''){
            throw new BadRequestException('Invalid username')
        }

        const user = await this.userRepo.findOne({where: {username}});
        console.log(user)
        if(!user){
            throw new NotFoundException('User not found')
        }
        await this.userRepo.delete({username});
        console.log(user)
    }
}
