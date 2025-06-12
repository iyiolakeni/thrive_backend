import { LoginDetails } from "src/entities/login.entity/logindetails.entity";
import { PasswordRest } from "src/entities/user.entity/password.entity";
import { User } from "src/entities/user.entity/user.entity";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "postgres",
	password: "admin",
	database: "Thrive_DB",
	// url: "postgres://default:pguX9yMWco8T@ep-lucky-frost-a402y3x7-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
	entities: [User, LoginDetails, PasswordRest],
	migrations: ["src/migration/**/*.ts"],
	logging: true,
	synchronize: false,
});
