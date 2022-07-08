import teams from "../development_seed_data/02-teams.js";

export const seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("teams").del()
  // Inserts seed entries
  await knex("teams").insert(teams)
  await knex.raw(`ALTER SEQUENCE teams_id_seq RESTART WITH 2`);
};
