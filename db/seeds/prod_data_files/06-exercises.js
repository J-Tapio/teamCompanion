import { exercises } from "../../../exercisesToEquipment.js";

export const seed = function (knex) {
  return knex("exercises")
    .then(function () {

      let formattedEx = exercises.map((exercise) => {
        return {
          exerciseName: exercise,
          createdBy: 1
        }
      });

      return knex("exercises").insert(formattedEx);
    });
};