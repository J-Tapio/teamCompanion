import userInformation from "../test_seed_data/03-userInformation.js";

export const seed = async function(knex) {
  await knex("user_information").del()
  await knex("user_information").insert(userInformation);
  await knex.raw(`ALTER SEQUENCE user_information_id_seq RESTART WITH 6`);
};
