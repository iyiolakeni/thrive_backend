import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { User } from 'src/entities/user.entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserdto: CreateUserDto): Promise<User>;
    getAllusers(): Promise<User[]>;
    getUser(username: string): Promise<User>;
    updateUser(username: string, updateUserDto: UpdateUserDto): Promise<User>;
    deleteUser(username: string): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map