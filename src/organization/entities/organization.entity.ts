import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";

@Entity({name: "organization"})
export class OrganizationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name", nullable: false, unique: true})
  name: string

  @Column({ name: "adress", nullable: false})
  address: string

  @OneToMany(() => UserEntity, (user: UserEntity) => user.organization, { eager: false })
  @Exclude()
  users: UserEntity[];
}