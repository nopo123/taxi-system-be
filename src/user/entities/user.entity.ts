import { Exclude } from 'class-transformer';
import { passwordHash } from 'src/common/helpers/password.helper';
import { OrderEntity } from 'src/order/entities/order.entity';
import { OrganizationEntity } from 'src/organization/entities/organization.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'firstName', nullable: false })
  firstName: string;

  @Column({ name: 'lastName', nullable: false })
  lastName: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'email', nullable: false, unique: true })
  email: string;

  @Column({ name: 'role', nullable: false })
  role: string;

  @Column({ name: 'organization_id', nullable: true, default: null })
  organizationId: number | null;

  @OneToMany(() => OrderEntity, (order: OrderEntity) => order.user, {
    eager: false,
  })
  orders: OrderEntity[];

  @ManyToOne(
    () => OrganizationEntity,
    (organization: OrganizationEntity) => organization.users,
    { eager: false },
  )
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await passwordHash(this.password);
    }
  }
}
