import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
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
  entities: [__dirname + '/**/*.entity{.ts}'],
  migrations: [__dirname + '/migrations/*.ts'],
};

export const AppDataSource = new DataSource(dataSourceOptions);
export default dataSourceOptions;
