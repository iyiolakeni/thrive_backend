import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user.entity/User.entity";

@Entity()
export class LoginDetails {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => User, (user) => user.loginHistory)
	@JoinColumn({ name: "userId" })
	user: User;

	@Column()
	userId: string;

	@CreateDateColumn({ type: "timestamp" })
	loginTime: Date;

	@Column({ type: "varchar", length: 15 })
	ipAddress: string;

	@Column({ type: "varchar" })
	deviceInfo: string;

	@Column({ nullable: true })
	userAgent: string;

	@Column({ default: true })
	loginSuccess: boolean;
}
