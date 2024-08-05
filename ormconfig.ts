import { Business } from "src/entities/business.entity/business.entity";
import { User } from "src/entities/user.entity/user.entity";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "ep-lucky-frost-a402y3x7-pooler.us-east-1.aws.neon.tech" ,
    port: 5432,
    username: "default",
    password: "pguX9yMWco8T",
    database: "verceldb",
    url: "postgres://default:pguX9yMWco8T@ep-lucky-frost-a402y3x7-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
    entities: [User, Business],
    migrations: ["dist/migration/**/*.js"],
    synchronize: false
})