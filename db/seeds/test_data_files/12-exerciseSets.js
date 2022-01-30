import exerciseSets from "../test_seed_data/12-exerciseSets.js";

export const seed = async function(knex) {
  await knex("exercise_sets").del()
  await knex("exercise_sets").insert(exerciseSets);
  await knex.raw(`ALTER SEQUENCE exercise_sets_id_seq RESTART WITH 15`);
  }