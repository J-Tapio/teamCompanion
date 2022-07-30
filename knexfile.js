import { knexSnakeCaseMappers } from "objection";
import pg from "pg";
import 'dotenv/config';
const types = pg.types;

/** 
 * Do not modify date-of-birth column value to Date object when returned
 * Seems to do this by default
*/
types.setTypeParser(types.builtins.DATE, (val) => val);
/** 
  * Postgres by default returns decimals in string format to avoid rounding errors.
  * Referencing StackOverflow answer: https://stackoverflow.com/questions/45569216/knex-postgres-returns-strings-for-numeric-decimal-values and https://stackoverflow.com/questions/39168501/pg-promise-returns-integers-as-strings/39176670#39176670
  * Since the request body values for assigned_ex_weight column in exercise_sets table is validated with AJV8 by 'multipleOf: 0.250', decision is to return value as decimal since eg. for weight of 30 should only 30, 30.25 (or 30.250), 30.50 (or 30.500), 30.75 (or 30.750) be valid input values. 
  * Decimal is valid JSON but controversial topic https://stackoverflow.com/questions/35709595/why-would-you-use-a-string-in-json-to-represent-a-decimal-number
  * For eg. business/payment use-cases returning string format would be safe as suggested.
*/
// Number(val)
types.setTypeParser(types.builtins.NUMERIC, (val) => +val);

export default {
  test: {
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
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds/test_data_files",
    },
    ...knexSnakeCaseMappers(),
  },
  development: {
    client: "pg",
    connection: process.env.DEV_DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds/development_data_files",
    },
    ...knexSnakeCaseMappers(),
  },
};
/* production: {
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
}, */

/* {
      database: "teamcompanion_db_development",
      user: process.env.DEV_POSTGRES_USER,
      password: process.env.DEV_POSTGRES_PASSWORD,
      host: "localhost",
      port: 5555,
    }, */
