import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from './user.entity';

@Entity({name: 'notes'})
export class NoteEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id'})
    id?: number;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'details' })
    details: string;

    @Column({ name: 'user_id'})
    userID: string;

    @Column({ name: "created_at" })
    createdAt!: Date;

    @Column({ name: "updated_at" })
    updatedAt!: Date;

    @ManyToOne(() => UserEntity, user => user.note)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id'})
    user?: UserEntity;
    
    

    constructor(description: string, details: string, userID:string) {
        super();
        this.description = description;
        this.details = details;
        this.userID = userID;
    }

    @BeforeInsert()
    private date() {        
        this.createdAt = new Date(Date.now());
        this.updatedAt = new Date(Date.now());
    };
    
    @BeforeUpdate()
    private update() {
        this.updatedAt = new Date(Date.now());
    };
}