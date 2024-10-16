import { Exclude } from 'class-transformer';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'firstName', nullable: false })
  firstName: string;

  @Column({ name: 'lastName', nullable: false })
  lastName: string;

  @Column({ name: 'route', nullable: false })
  route: string;

  @Column({ name: 'date', nullable: false })
  date: Date;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({
    name: 'distance',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  distance: number;

  @Column({
    name: 'second_driver',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  secondDriver: number;

  @Column({
    name: 'waiting_time',
    type: 'decimal',
    nullable: false,
    precision: 10,
    scale: 2,
  })
  waitingTime: number;

  @Column({ name: 'drive_signature', nullable: false })
  driverSignature: string;

  @Column({ name: 'client_signature', nullable: false })
  clientSignature: string;

  @Column({ name: 'organization_id', nullable: false })
  @Exclude()
  organizationId: number;

  @Column({ name: 'userId', nullable: false })
  @Exclude()
  userId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.orders, {
    eager: false,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
