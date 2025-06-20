import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity/user.entity";
import { LoginDetails } from "src/entities/login.entity/logindetails.entity";
import { PasswordRest } from "src/entities/user.entity/password.entity";
import { EmailService } from "src/email/email.service";

@Module({
	imports: [TypeOrmModule.forFeature([User, LoginDetails, PasswordRest])],
	providers: [UserService, EmailService],
	controllers: [UserController],
	exports: [UserService, TypeOrmModule.forFeature([User, LoginDetails])],
})
export class UserModule {}
