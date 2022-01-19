import { strEquipment, cardioEquipment } from "../../../exercisesToEquipment.js";

export const seed = function(knex) {

    let formattedStrEq = strEquipment.map((equipment) => {
      return {
        equipmentName: equipment,
        trainingModality: "Strength",
        createdBy: 1,
      };
    });

    let formattedCardioEq = cardioEquipment.map((equipment) => {
      return {
        equipmentName: equipment,
        trainingModality: "Cardio",
        createdBy: 1,
      }
    });

    return knex("equipment").insert([...formattedCardioEq, ...formattedStrEq]);
};