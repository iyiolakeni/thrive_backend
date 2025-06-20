import { Purchase } from "src/purchase/entities/purchase.entity";
import { Entity, OneToMany } from "typeorm";
import { Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TransactionDetail {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ unique: true })
	paymentReference: string;

	@Column()
	paymentStatus: boolean;

	@Column()
	paymentMethod: string;

	@Column({ type: "decimal", precision: 10, scale: 2 })
	totalPrice: number;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt: Date;

	@OneToMany(() => Purchase, (purchase) => purchase.transactionDetail)
	purchases: Purchase[];
}
