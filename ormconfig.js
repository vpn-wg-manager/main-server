const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

module.exports = {
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  entities: ['dist/**/*.orm.js'],
  synchronize: false,
  migrations: ['dist/**/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: false,
  timezone: 'Z',
};
