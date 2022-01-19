import Equipment from "../../db/models/equipment.model.js";
import Exercises from "../../db/models/exercises.model.js";
import ExercisesEquipment from "../../db/models/exercisesEquipment.model.js";
import errorHandler from "../tools/dbErrors.js";
import dbResultHandlers from "./dbResultHandlers/exercises.js";


async function allExercises(request, reply) {
  try {
    const exercises = await Exercises.query()
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

    reply.send(dbResultHandlers.allEx(exercises));
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function exerciseById(request, reply) {
  try {
    const exercise = await Exercises.query()
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
      .where("exercises.id", request.params.id)
      .throwIfNotFound();

    reply.send(dbResultHandlers.byIdEx(exercise));
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createExercise(request, reply) {
  try {
    const { 
      id, 
      exerciseName, 
      exerciseInfo, 
      createdAt
    } = await Exercises.query()
    .insert({...request.body, createdBy: request.user.id})
    .returning("*");

    reply.status(201).send({ id, exerciseName, exerciseInfo, createdAt });
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateExercise(request, reply) {
  try {
    const updatedExercise = await Exercises.query()
    .patch(request.body)
    .where("exercises.id", request.params.id)
    .returning("id", "exerciseName", "exerciseInfo", "updatedAt")
    .first()
    .throwIfNotFound();

    reply.send(updatedExercise);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteExercise(request, reply) {
  try {
    await Exercises.query().deleteById(request.params.id).throwIfNotFound();
    reply.status(204);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function allExEq(request, reply) {
  try {
    let exercises = await Exercises.query().select("id", "exerciseName");
    let equipment = await Equipment.query().select("id", "equipmentName");
    const data =  {exercises,equipment}
    reply.send({data});
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createExEq(request, reply) {

  const equipmentId = !request.body.equipmentId
    ? await createNewEquipment(request)
    : request.body.equipmentId;

  const exerciseId = !request.body.exerciseId
    ? await createNewExercise(request)
    : request.body.exerciseId;

  const newExEq = await addNewExEqConnection(exerciseId, equipmentId, request);
  reply.status(201).send(newExEq);

  async function createNewExercise(request) {
    try {
      const {id} = await Exercises.query()
        .insert({
          exerciseName: request.body.exerciseName,
          exerciseInfo: request.body.exerciseInfo || null,
          createdBy: request.user.id,
        })
        .returning("*");
      return id;

    } catch (error) {
      errorHandler(error, reply);
    }
  }

  async function createNewEquipment(request) {
    try {
      const {id} = await Equipment.query()
        .insert({
          equipmentName: request.body.equipmentName,
          equipmentInfo: request.body.equipmentInfo || null,
          trainingModality: request.body.trainingModality,
          createdBy: request.user.id,
        })
        .returning("*");

      return id;
    } catch (error) {
      errorHandler(error, reply);
    }
  }

  async function addNewExEqConnection(exerciseId, equipmentId, request) {

    try {
      // Created exercise-equipment join table id:
      const { id } = await ExercisesEquipment.query()
        .insert({
          exerciseId,
          equipmentId,
          exerciseVariations: request.body.exerciseVariations || null,
          exercisePositions: request.body.exercisePositions || null,
          exerciseInformation: request.body.exerciseInformation || null,
        })
        .returning("*");

      return await ExercisesEquipment.query()
        .join("exercises", "exercises.id", "=", "exercisesEquipment.exerciseId")
        .join(
          "equipment",
          "equipment.id",
          "=",
          "exercisesEquipment.equipmentId"
        )
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
        .where("exercisesEquipment.id", id).first();
    } catch (error) {
      errorHandler(error, reply);
    }
  }
}


export default {
  allExercises,
  exerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  allExEq,
  createExEq
};