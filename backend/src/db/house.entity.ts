import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';


@Entity()
export class Houses
 {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    address: string;

    @Column()
    rental: number;
    
    @Column()
    area: number;

    @Column()
    rooms: number;

    @Column()
    floors: number;

    @Column({default:true})
    isAvailable: boolean;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @Column()
    managedBy: number;

}