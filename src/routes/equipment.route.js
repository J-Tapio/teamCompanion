// controller, schemas
import equipmentHandlers from "../controllers/equipment.controller.js";
import validationHandlers from "../controllers/preValidation/preValidators.js";
import preHandlers from "../controllers/preHandlers/preHandlers.js";
import equipmentSchemas from "../controllers/validationSchemas/equipment.schemas.js";
const { authenticateUser } = validationHandlers;
const { checkTrainingAdminRole, checkResourceCreator } = preHandlers;

export default [
  {
    method: "GET",
    url: "/equipment",
    schema: equipmentSchemas.allEquipment,
    preValidation: authenticateUser,
    preHandler: checkTrainingAdminRole,
    handler: equipmentHandlers.allEquipment,
    config: {
      description: "Retrieve all equipment with exercise info",
    },
  },
  {
    method: "POST",
    url: "/equipment",
    schema: equipmentSchemas.createEquipment,
    preValidation: authenticateUser,
    preHandler: checkTrainingAdminRole,
    handler: equipmentHandlers.createEquipment,
    config: {
      description: "Create a new equipment",
    },
  },
  {
    method: "GET",
    url: "/equipment/:id",
    schema: equipmentSchemas.equipmentById,
    preValidation: authenticateUser,
    preHandler: checkTrainingAdminRole,
    handler: equipmentHandlers.equipmentById,
    config: {
      description: "Retrieve equipment by id",
    },
  },
  {
    method: "PUT",
    url: "/equipment/:id",
    schema: equipmentSchemas.updateEquipment,
    preValidation: authenticateUser,
    preHandler: [checkTrainingAdminRole, checkResourceCreator],
    handler: equipmentHandlers.updateEquipment,
    config: {
      description: "Update equipment by id",
    },
  },
  {
    method: "DELETE",
    url: "/equipment/:id",
    schema: equipmentSchemas.deleteEquipment,
    preValidation: authenticateUser,
    preHandler: [checkTrainingAdminRole, checkResourceCreator],
    handler: equipmentHandlers.deleteEquipment,
    config: {
      description: "Delete equipment by id",
    },
  },
];
