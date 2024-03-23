import { DataSource, DataSourceOptions } from 'typeorm';
 
let dbOptions: DataSourceOptions = {
  type: 'sqlite',
  database: '',
  entities: [],
  synchronize:true,
  migrations: ['dist/db/migrations/*.js'],
};
 
switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbOptions, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbOptions, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.js'],
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dbOptions, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      entities: ['**/*.entity.js'],
    })
    break;
  default:
    throw new Error('Unknown environment');
}
 
export const dataSourceOptions: DataSourceOptions = dbOptions;
 
const dataSource = new DataSource(dataSourceOptions);
 
export default dataSource;