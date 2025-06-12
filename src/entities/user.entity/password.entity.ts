import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class PasswordRest {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	email: string;

	@Column()
	resetToken: string;

	@Column()
	expirationDate: Date;

	@Column({ default: false })
	isUsed: boolean;

	@ManyToOne(() => User)
	@JoinColumn({ name: "userId" })
	user: User;

	@Column()
	userId: string;
}
