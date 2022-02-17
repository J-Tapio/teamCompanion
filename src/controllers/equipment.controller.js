import errorHandler from "../lib/errorHandler.js";
import EquipmentQueries from "../controllers/dbQueries/equipment.queries.js";

async function allEquipment(request, reply) {
  try {
    let data = await EquipmentQueries.allEquipment();
    reply.send(data);

  } catch (error) {
    errorHandler(error, reply);
  }
}

async function equipmentById(request, reply) {
  try {
    let equipment = await EquipmentQueries.equipmentById({
      equipmentId: request.params.id
    });
    reply.send(equipment);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createEquipment(request, reply) {
  try {
    let createdEquipment = await EquipmentQueries.createEquipment({
      userId: request.user.id,
      equipmentInformation: request.body,
    });
    reply.status(201).send(createdEquipment);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateEquipment(request, reply) {
  try {
    let updatedEquipment = await EquipmentQueries.updateEquipment({
      equipmentId: request.params.id,
      updateInformation: request.body
    });

    reply.send(updatedEquipment);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteEquipment(request, reply) {
  try {
    await EquipmentQueries.deleteEquipment({equipmentId: request.params.id})
    reply.status(204).send();
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