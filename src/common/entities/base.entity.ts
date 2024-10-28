import { BeforeUpdate, Column } from 'typeorm';

export class BaseEntity {

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date;
  }
}
