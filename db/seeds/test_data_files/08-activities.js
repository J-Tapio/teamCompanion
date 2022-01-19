import activities from "../test_seed_data/08-activities.js"

export const seed = async function (knex) {
  await knex("activities").del()
  await knex("activities").insert(activities);
  await knex.raw(`ALTER SEQUENCE activities_id_seq RESTART WITH 6`);
}