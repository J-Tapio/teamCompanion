import userTeamActivities from "../test_seed_data/11-userTeamActivities.js";

export const seed = async function (knex) {
  await knex("user_team_activities").del();
  await knex("user_team_activities").insert(userTeamActivities);
  await knex.raw(`ALTER SEQUENCE user_team_activities_id_seq RESTART WITH 15`);
};