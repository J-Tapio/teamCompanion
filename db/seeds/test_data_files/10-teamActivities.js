import teamActivities from "../test_seed_data/10-teamActivities.js";

export const seed = async function (knex) {
  await knex("team_activities").del();
  await knex("team_activities").insert(teamActivities);
  await knex.raw(`ALTER SEQUENCE team_activities_id_seq RESTART WITH 7`);
};
