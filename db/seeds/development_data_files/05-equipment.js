import equipment from "../development_seed_data/05-equipment.js";

export const seed = async function(knex) {
  await knex("equipment").del()
  await knex("equipment").insert(equipment);
  await knex.raw(`ALTER SEQUENCE equipment_id_seq RESTART WITH 9`);
}