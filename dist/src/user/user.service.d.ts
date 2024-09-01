import { User } from 'src/entities/user.entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
export declare class UserService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    findOneByEmail(email: string): Promise<User | undefined>;
    create(createUserDto: CreateUserDto): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getUser(username: string): Promise<User>;
    updateUser(username: string, updateuserDto: UpdateUserDto): Promise<User>;
    deleteUser(username: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map