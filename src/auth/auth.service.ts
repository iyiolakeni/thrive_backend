import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { User } from 'src/entities/user.entity/user.entity';

@Injectable()
export class AuthService {
    constructor (
        private usersService: UserService,
        private jwtService: JwtService,
    ){}

    async validateUser(email: string, password: string): Promise<any>{
        const user = await this.usersService.findOneByEmail(email);
        console.log(user)
        if (user && await bcrypt.compare(password, user.password)){
            const {
                password,
                ...result
            } = user;
            return result;
        }
        return null
    }

    async login(user: any){
        const payload = {
            email: user.email, sub: user.id};
        return{
            access_token: this.jwtService.sign(payload),
        };
    }
}
