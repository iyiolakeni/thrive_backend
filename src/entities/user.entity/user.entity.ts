import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    username: string;

    @Column()
    email: string

    @Column()
    phoneNo: string
    
    @Column() 
    password: string

    @Column({default: true})
    isActive: boolean

    @Column()
    lastLogin: Date;

    @Column()
    dob: Date 

    @Column()
    registrationDate: Date

}
