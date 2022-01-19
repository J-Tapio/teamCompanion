import Equipment from "../../db/models/equipment.model.js";
import errorHandler from "../tools/dbErrors.js";
import dbResultHandler from "../controllers/dbResultHandlers/equipment.js";


async function allEquipment(request, reply) {
  try {
    const data = await Equipment.query()
      .joinRelated({ exercises: true })
      .select(
        "equipment.id",
        "equipment.equipmentName",
        "equipment.trainingModality",
        "equipment.equipmentInfo",
        "exercises.id as exerciseId",
        "exercises.exerciseName",
        "exercises.exerciseInfo",
        "exercises_join.exerciseVariations",
        "exercises_join.exercisePositions",
        "exercises_join.exerciseInformation"
      )
      .orderBy("equipment.id", "asc")
      .orderBy("equipmentId", "asc").throwIfNotFound();

      reply.send(dbResultHandler.allEq(data));


  } catch (error) {
    errorHandler(error, reply);
  }
}

async function equipmentById(request, reply) {
  try {
    const equipment = await Equipment.query()
      .joinRelated({ exercises: true })
      .select(
        "equipment.id",
        "equipment.equipmentName",
        "equipment.trainingModality",
        "equipment.equipmentInfo",
        "exercises.id as exerciseId",
        "exercises.exerciseName",
        "exercises.exerciseInfo",
        "exercises_join.exerciseVariations",
        "exercises_join.exercisePositions",
        "exercises_join.exerciseInformation"
      )
      .orderBy("equipmentId", "asc")
      .where("equipment.id", request.params.id)
      .throwIfNotFound();

    reply.send(dbResultHandler.byIdEq(equipment));
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createEquipment(request, reply) {
  try {
    const { id, equipmentName, trainingModality, equipmentInfo, createdAt } =
      await Equipment.query()
        .insert({ ...request.body, createdBy: request.user.id })
        .returning("*");
        
    reply.status(201).send({id, equipmentName, trainingModality, equipmentInfo, createdAt });
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateEquipment(request, reply) {
  try {
    const updatedEquipment = await Equipment.query()
    .patch(request.body)
    .where("equipment.id", request.params.id)
    .returning(
      "id", 
      "equipmentName", 
      "trainingModality", 
      "equipmentInfo", 
      "updatedAt")
    .first()
    .throwIfNotFound();

    reply.send(updatedEquipment);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteEquipment(request, reply) {
  try {
    await Equipment.query().deleteById(request.params.id).throwIfNotFound();
    reply.status(204);
  } catch (error) {
    errorHandler(error, reply);
  }
}

export default {
  allEquipment,
  equipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
}