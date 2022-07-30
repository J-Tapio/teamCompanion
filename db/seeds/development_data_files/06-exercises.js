import exercises from "../development_seed_data/06-exercises.js";

export const seed = async function (knex) {
  await knex("exercises").del()
  await knex("exercises").insert(exercises);
  await knex.raw(`ALTER SEQUENCE exercises_id_seq RESTART WITH 11`);
};