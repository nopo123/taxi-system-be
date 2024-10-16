import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('order_user')
export class OrderUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ name: 'organization_id', nullable: false })
  organizationId: number;
}