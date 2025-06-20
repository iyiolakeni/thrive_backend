import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user.entity/User.entity";
import { Product } from "src/products/entities/products.entity";

@Entity()
export class Business {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	// Business Information
	@Column()
	businessName: string;

	@Column()
	businessAddress: string;

	@Column()
	registrationNumber?: string;

	@Column({ nullable: true })
	storeLogo?: string; // Assume it's a URL or file path

	// Banking Information
	@Column()
	bankName: string;

	@Column()
	bankAccountNumber: string;

	@Column()
	bank_code: string;

	// Legal and Compliance
	@Column({ default: true })
	vendorAgreement: boolean;

	// Shipping and Return Policy
	@Column({ default: true })
	returnPolicy: boolean;

	@OneToOne(() => User, (user) => user.business)
	@JoinColumn({ name: "userId" })
	user: User;

	@Column()
	userId: string;

	@Column({ default: false })
	isVerified: boolean;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	registrationDate: Date;

	@Column({ type: "timestamp", nullable: true })
	verificationDate?: Date;

	@Column({ default: false })
	isActive: boolean;

	@Column({ type: "timestamp", nullable: true })
	modificationDate?: Date;

	@OneToMany(() => Product, (products) => products.business)
	products: Product[];
}
