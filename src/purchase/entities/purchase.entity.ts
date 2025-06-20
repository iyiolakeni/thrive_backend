import { User } from "src/entities/user.entity/User.entity";
import { Product } from "src/products/entities/Product.entity";
import { TransactionDetail } from "src/transaction-details/entities/TransactionDetail.entity";
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Purchase {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	quantity: number;

	@ManyToOne(() => Product)
	@JoinColumn({ name: "productId" })
	product: Product;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	price: number;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt: Date;

	@ManyToOne(
		() => TransactionDetail,
		(transactionDetail) => transactionDetail.purchases
	)
	@JoinColumn({ name: "transactionDetailId" })
	transactionDetail: TransactionDetail;

	@ManyToOne(() => User)
	@JoinColumn({ name: "userId" })
	user: User;

	@Column()
	paymentReference: string;
}
