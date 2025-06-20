import { ProductCategory } from "src/product-categories/entities/product-category";
import { Business } from "src/entities/business.entity/business.entity";
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
@Entity()
export class Product {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	name: string;

	@Column()
	description: string;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	unitPrice: number;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	price: number;

	@Column({ default: true })
	isAvailable: boolean;

	@Column({ default: 0 })
	stock: number;

	@Column({ default: 0 })
	discount: number;

	@Column({ default: 0, nullable: true })
	rating: number;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt: Date;

	@Column({ nullable: true })
	imageUrl: string;

	@ManyToOne(() => Business, (business) => business.products, {
		onDelete: "SET NULL",
	})
	@JoinColumn()
	business: Business;

	@ManyToOne(() => ProductCategory, (category) => category.products, {
		onDelete: "SET NULL",
	})
	@JoinColumn()
	category: ProductCategory;

	@Column({ default: "a25c1f19-7a9d-44cd-b471-9a280438efa0" })
	categoryId: string;

	@Column({ default: "2e0d28fb-c8c9-4790-bbd2-dfe36f3cd0f3" })
	businessId: string;
}
