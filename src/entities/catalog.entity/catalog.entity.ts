import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Catalog {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ unique: true })
	productTracker: string;

	@Column()
	category: string;

	@Column()
	brandName: string;

	@Column({ nullable: true })
	modelNumber: string;

	@Column("text")
	shortDescription: string;

	@Column("text")
	longDescription: string;

	@Column("text", { array: true })
	images: string[];

	@Column("decimal")
	price: number;

	@Column("decimal", { nullable: true })
	discountPrice: number;

	@Column({ default: true })
	availabilityStatus: boolean;

	@Column("decimal")
	shippingCost: number;

	@Column("text")
	warrantyInformation: string;

	@Column("text", { nullable: true })
	returnPolicy: string;

	@Column()
	createdBy: string;
}
