import users from "../test_seed_data/01-users.js";

export const seed = async function (knex) {
    // Deletes ALL existing entries
    await knex("users").del();
    // Inserts seed entries
    await knex("users").insert(users);
    // Alters id sequence. Needed within tests, when adding new users etc.
    await knex.raw(`ALTER SEQUENCE users_id_seq RESTART WITH 7`);
  };
