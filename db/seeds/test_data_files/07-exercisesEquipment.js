import exercisesEquipment from "../test_seed_data/07-exercisesEquipment.js";

export const seed = async function (knex) {
  await knex("exercises_equipment").del()
  await knex("exercises_equipment").insert(exercisesEquipment);
  await knex.raw(`ALTER SEQUENCE exercises_equipment_id_seq RESTART WITH 9`);
};