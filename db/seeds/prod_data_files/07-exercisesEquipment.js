import { exEqdata } from "../../../exercisesToEquipment.js";

// Return exercises id & exercise name
// Return equipment id & equipment name
// Loop data, replace exercise name with corresponding db id (refer to name equality).
// Loop data, replace equipment name with corresponding db id (refer to name equality).

export const seed = async function(knex) {
  const eq_from_db = await knex("equipment").select("equipmentId", "equipment_name");
  const ex_from_db = await knex("exercises").select("exerciseId", "exercise_name");

  console.log(exEqdata);

  let data = exEqdata.map((exEq) => {
    let equipmentId;
    let exerciseId;

    for(let i=0; i < eq_from_db.length; i++) {
      if (exEq.equipmentName === eq_from_db[i].equipmentName) {
        equipmentId = eq_from_db[i].id;
      }
    }

    for(let i=0; i < ex_from_db.length; i++) {
      if(exEq.exerciseName === ex_from_db[i].exerciseName) {
        exerciseId = ex_from_db[i].id;
      }
    }

    return {
      equipmentId: equipmentId,
      exerciseId: exerciseId,
      exerciseVariations: exEq.exerciseVariations || null,
      exercisePositions: exEq.exercisePositions || null,
      exerciseInformation: exEq.exerciseInfo || null,
    };
  });
  console.log(data);

  await knex("exercisesEquipment").insert(data);
}
