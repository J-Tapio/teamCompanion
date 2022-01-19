import { knexSnakeCaseMappers } from "objection";
import pg from "pg";
const types = pg.types;

// Does not modify date-of-birth column value to Date object when returned
// Seems to do this by default
types.setTypeParser(types.builtins.DATE, (val) => val);

export default {
  development: {
    client: "pg",
    connection: {
      database: "teamcompanion_db_test",
      user: "postgres",
      password: "salasana",
      host: "localhost",
      port: 5444,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: process.cwd() + "/db/migrations",
    },
    seeds: {
      directory: process.cwd() + "/db/seeds/test_data_files",
    },
    ...knexSnakeCaseMappers(),
  },

  production: {
    client: "pg",
    connection: {
      database: "",
      user: "",
      password: "",
      host: "",
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: process.cwd() + "/db/migrations",
    },
    seeds: {
      directory: process.cwd() + "/db/seeds/prod_data_files",
    },
    ...knexSnakeCaseMappers(),
  },
};
