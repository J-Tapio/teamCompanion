import venues from "../test_seed_data/09-venues.js";

export const seed = async function (knex) {
  await knex("venues").del();
  await knex("venues").insert(venues);
  await knex.raw(`ALTER SEQUENCE venues_id_seq RESTART WITH 5`);
};

