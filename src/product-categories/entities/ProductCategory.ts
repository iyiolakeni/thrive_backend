import { ProductCategoryType } from "src/entities/enum";
import { Product } from "src/products/entities/Product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductCategory {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ unique: true })
	name: string;

	@Column({ nullable: true })
	description: string;

	@Column({
		type: "enum",
		enum: ProductCategoryType,
		default: ProductCategoryType.DIGITAL,
	})
	categoryType: ProductCategoryType;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt: Date;

	@Column({ default: true })
	isActive: boolean;

	@Column({ default: 0 })
	totalPurchases: number;

	@OneToMany(() => Product, (products) => products.category)
	products: Product[];
}
