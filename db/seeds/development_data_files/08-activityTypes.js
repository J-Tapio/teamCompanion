import activityTypes from "../test_seed_data/08-activityTypes.js"

export const seed = async function (knex) {
  await knex("activity_types").del()
  await knex("activity_types").insert(activityTypes);
  await knex.raw(`ALTER SEQUENCE activity_types_id_seq RESTART WITH 6`);
}