import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity()
export class WithdrawalHistory {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	amount: number;

	@Column()
	withdrawnBy: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	withdrawnAt: Date;

	@Column({ enum: ["pending", "completed", "failed"], default: "pending" })
	status: string;

	@UpdateDateColumn()
	updatedAt: Date;
}
