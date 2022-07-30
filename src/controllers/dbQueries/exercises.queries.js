import Exercises from "../../../db/models/exercises.model.js";
import Equipment from "../../../db/models/equipment.model.js";
import ExercisesEquipment from "../../../db/models/exercisesEquipment.model.js";
import ExercisesQueryFormatter from "../dbResultFormatters/exercises.resultformatter.js";
import EquipmentQueries from "./equipment.queries.js";

export default class ExercisesQueries extends ExercisesQueryFormatter {

  static async allExercises() {
    let dbResults = await Exercises.query()
      .joinRelated({ equipment: true })
      .select(
        "exercises.id",
        "exercises.exerciseName",
        "exercises.exerciseInfo",
        "equipment.id as equipmentId",
        "equipment.equipmentName",
        "equipment.equipmentInfo",
        "equipment.trainingModality",
        "equipment_join.exerciseVariations",
        "equipment_join.exercisePositions",
        "equipment_join.exerciseInformation"
      )
      .orderBy("exercises.id", "asc")
      .orderBy("equipmentId", "asc")
      .throwIfNotFound();
    
    return ExercisesQueryFormatter.allExercises(dbResults);
  }


  static async exerciseById({exerciseId}) {
    let dbResult = await Exercises.query()
      .joinRelated({ equipment: true })
      .select(
        "exercises.id",
        "exercises.exerciseName",
        "exercises.exerciseInfo",
        "equipment.id as equipmentId",
        "equipment.equipmentName",
        "equipment.equipmentInfo",
        "equipment.trainingModality",
        "equipment_join.exerciseVariations",
        "equipment_join.exercisePositions",
        "equipment_join.exerciseInformation"
      )
      .orderBy("equipmentId", "asc")
      .where("exercises.id", exerciseId)
      .throwIfNotFound();
    
    return ExercisesQueryFormatter.exerciseById(dbResult);
  }


  static async createExercise({userId, exerciseInformation}) {
    let { updatedAt, ...createdExercise } = await Exercises.query()
      .insert({ ...exerciseInformation, createdBy: userId })
      .returning("*");
    return createdExercise;
  }

  static async updateExercise({exerciseId, requestUserId, updateInformation}) {
    let {createdAt, ...updatedExercise} = await Exercises.query()
      .patch(updateInformation)
      .where({
        id: exerciseId,
        createdBy: requestUserId
      })
      .returning("*")
      .first()
      .throwIfNotFound();
    return updatedExercise;
  }


  static async deleteExercise({exerciseId}) {
    await Exercises.query()
    .deleteById(exerciseId)
    .throwIfNotFound();
  }

  //TODO: Consider own route for existing extoeq information. Newly added as needed for inserting exercises to program.
  static async allExercisesAndEquipment() {
    let exercises = await Exercises.query().select("id", "exerciseName");
    let equipment = await Equipment.query().select("id", "equipmentName");
    return { exercises, equipment };
  }

  static async exerciseToEquipmentId(equipmentId, exerciseId) {
    /*     .select(
          "exercisesEquipment.id",
          "exercisesEquipment.exerciseId",
          "exercises.exerciseName",
          "exercisesEquipment.equipmentId",
          "equipment.equipmentName",
        ) */

    let data = await ExercisesEquipment.query()
      .join("exercises", "exercises.id", "=", "exercisesEquipment.exerciseId")
      .join("equipment", "equipment.id", "=", "exercisesEquipment.equipmentId")
      .select("exercisesEquipment.id")
      .where("exercisesEquipment.equipmentId", equipmentId)
      .andWhere("exercisesEquipment.exerciseId", exerciseId)
      .first()
      .throwIfNotFound();

      return data;
  }


  static async #addNewExerciseEquipment(exerciseEquipment) {
    // Created exercise-equipment join table id:
    let { id } = await ExercisesEquipment.query()
      .insert(exerciseEquipment)
      .returning("*");

    return await ExercisesEquipment.query()
      .join("exercises", "exercises.id", "=", "exercisesEquipment.exerciseId")
      .join("equipment", "equipment.id", "=", "exercisesEquipment.equipmentId")
      .select(
        "exercisesEquipment.exerciseId",
        "exercises.exerciseName",
        "exercises.exerciseInfo",
        "exercisesEquipment.equipmentId",
        "equipment.equipmentName",
        "equipment.equipmentInfo",
        "exercisesEquipment.exerciseVariations",
        "exercisesEquipment.exercisePositions",
        "exercisesEquipment.exerciseInformation",
        "equipment.trainingModality",
        "exercisesEquipment.createdAt"
      )
      .where("exercisesEquipment.id", id)
      .first();
  }


  static async createExerciseEquipment({userId, exerciseId, equipmentId, data}) {
    if(!exerciseId) {
      let exerciseInformation = {
        exerciseName: data.exerciseName,
        exerciseInfo: data.exerciseInfo,
      }
      exerciseId = (await this.createExercise({
        userId, exerciseInformation
      })).id
    }
    if(!equipmentId) {
      let equipmentInformation = {
        equipmentName: data.equipmentName,
        equipmentInfo: data.equipmentInfo,
        trainingModality: data.trainingModality,
      }
      equipmentId = (await EquipmentQueries.createEquipment({
        userId, equipmentInformation
      })).id;
    }

    let exerciseEquipment = {
      exerciseId,
      equipmentId,
      exerciseVariations: data.exerciseVariations || null,
      exercisePositions: data.exercisePositions || null,
      exerciseInformation: data.exerciseInformation || null,
    }
    return await this.#addNewExerciseEquipment(exerciseEquipment);
  }

}