import exerciseHandlers from "../controllers/exercises.controller.js";
import exerciseSchemas from "../controllers/validationSchemas/exercises.schema.js";
import validationHandlers from "../controllers/preValidation/preValidators.js";
import preHandlers from "../controllers/preHandlers/preHandlers.js";
const { authenticateUser } = validationHandlers;
const { checkTrainingAdminRole, checkResourceCreator } = preHandlers;

export default [
  {
    method: "GET",
    url: "/exercises",
    schema: exerciseSchemas.allExercises,
    preValidation: authenticateUser,
    preHandler: checkTrainingAdminRole,
    handler: exerciseHandlers.allExercises,
    config: {
      description: "Retrieve all exercises with equipment info",
    },
  },
  {
    method: "POST",
    url: "/exercises",
    schema: exerciseSchemas.createExercise,
    preValidation: authenticateUser,
    preHandler: checkTrainingAdminRole,
    handler: exerciseHandlers.createExercise,
    config: {
      description: "Create new exercise",
    },
  },
  {
    method: "GET",
    url: "/exercises/create",
    schema: exerciseSchemas.exercisesEquipment,
    preValidation: authenticateUser,
    preHandler: checkTrainingAdminRole,
    handler: exerciseHandlers.allExEq,
    config: {
      description: "Create new exercise & equipment",
    },
  },
  {
    method: "POST",
    url: "/exercises/create",
    schema: exerciseSchemas.createExerciseEquipment,
    preValidation: authenticateUser,
    preHandler: checkTrainingAdminRole,
    handler: exerciseHandlers.createExEq,
    config: {
      description: "Create new exercise & equipment",
    },
  },
  {
    method: "GET",
    url: "/exercises/:id",
    schema: exerciseSchemas.exerciseById,
    preValidation: authenticateUser,
    preHandler: checkTrainingAdminRole,
    handler: exerciseHandlers.exerciseById,
    config: {
      description: "Retrieve exercise by id",
    },
  },
  {
    method: "PUT",
    url: "/exercises/:id",
    schema: exerciseSchemas.updateExercise,
    preValidation: authenticateUser,
    preHandler: [checkTrainingAdminRole, checkResourceCreator],
    handler: exerciseHandlers.updateExercise,
    config: {
      description: "Update exercise by id",
    },
  },
  {
    method: "DELETE",
    url: "/exercises/:id",
    schema: exerciseSchemas.deleteExercise,
    preValidation: authenticateUser,
    preHandler: [checkTrainingAdminRole, checkResourceCreator],
    handler: exerciseHandlers.deleteExercise,
    config: {
      description: "Delete exercise by id",
    },
  },
];
