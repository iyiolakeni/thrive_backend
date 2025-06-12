import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserType } from "../enum";
import { LoginDetails } from "../login.entity/logindetails.entity";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ unique: true })
	username: string;

	@Column()
	email: string;

	@Column()
	phoneNo: string;

	@Column()
	password: string;

	@Column({ default: true })
	isActive: boolean;

	@Column()
	dob: Date;

	@Column({ type: "enum", enum: UserType, default: UserType.USER })
	userType: UserType;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	registrationDate: Date;

	@OneToMany(() => LoginDetails, (loginDetails) => loginDetails.user, {
		cascade: true,
	})
	loginHistory: LoginDetails[];
}
