import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { NoteEntity } from "./note.entity";

@Entity({name: 'users'})
export class UserEntity extends BaseEntity {
    @PrimaryColumn({ name: 'id'})
    id!: string;

    @Column({ name: 'username'})
    username!: string;

    @Column({ name: 'password'})
    password!: string;

    @Column({ name: "created_at" })
    createdAt!: Date;

    @Column({ name: "updated_at" })
    updatedAt!: Date;

    @OneToMany(() => NoteEntity, (note) => note.user)
    note?: NoteEntity[]
    

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }

    @BeforeInsert()
    private criarID() {
        this.id = uuid()
        this.createdAt = new Date(Date.now());
        this.updatedAt = new Date(Date.now());
    };
    
    @BeforeUpdate()
    private update() {
        this.updatedAt = new Date(Date.now());
    };
}