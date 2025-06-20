import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity/User.entity";
import { LoginDetails } from "src/entities/login.entity/login-details.entity";
import { PasswordRest } from "src/entities/user.entity/password-rest.entity";
import { EmailService } from "src/email/email.service";

@Module({
	imports: [TypeOrmModule.forFeature([User, LoginDetails, PasswordRest])],
	providers: [UserService, EmailService],
	controllers: [UserController],
	exports: [UserService, TypeOrmModule.forFeature([User, LoginDetails])],
})
export class UserModule {}
