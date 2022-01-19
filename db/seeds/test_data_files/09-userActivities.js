import userActivities from "../test_seed_data/09-userActivities.js";

export const seed = async function (knex) {
  await knex("user_activities").del();
  await knex("user_activities").insert(userActivities);
  await knex.raw(`ALTER SEQUENCE user_activities_id_seq RESTART WITH 6`);
};