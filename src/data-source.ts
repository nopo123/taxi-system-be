import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { UserEntity } from './user/entities/user.entity';
import { RolesEntity } from './roles/entities/roles.entity';
import { OrganizationEntity } from './organization/entities/organization.entity';
import { OrderUserEntity } from './order_user/entities/order-user.entity';
import { OrderEntity } from './order/entities/order.entity';
config();

const dataSourceOptions: DataSourceOptions = {
  // logging: true,
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  ssl: process.env.NODE_ENV == 'production',
  entities: [
    UserEntity,
    RolesEntity,
    OrganizationEntity,
    OrderUserEntity,
    OrderEntity  
  ],
  migrations: [__dirname + '/migrations/*.ts'],
};

export const AppDataSource = new DataSource(dataSourceOptions);
export default dataSourceOptions;
