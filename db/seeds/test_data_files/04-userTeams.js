import userTeams from "../test_seed_data/04-userTeams.js";

export const seed = async function(knex) {
  await knex("user_teams").del()
  await knex("user_teams").insert(userTeams);
  await knex.raw(`ALTER SEQUENCE user_teams_id_seq RESTART WITH 8`);
};
