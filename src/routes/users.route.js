import userController from "../controllers/users.controller.js";
import usersValidation from "../controllers/validationSchemas/users.schema.js";
import validationHandlers from "../controllers/preValidation/preValidators.js";
import preHandlers from "../controllers/preHandlers/preHandlers.js";
const { authenticateUser } = validationHandlers;
const {checkAdminRole} = preHandlers;

export default [
  {
    method: "GET",
    url: "/users",
    schema: usersValidation.allUsers,
    preValidation: authenticateUser,
    preHandler: checkAdminRole,
    handler: userController.allUsers,
    config: {
      description: "Retrieve all users",
    },
  },
  {
    method: "POST",
    url: "/users",
    schema: usersValidation.createUser,
    preValidation: authenticateUser,
    preHandler: checkAdminRole,
    handler: userController.createUser,
    config: {
      description: "Create new user",
    },
  },
  //TODO: WRITE TESTS FOR THESE TWO END-POINTS:
  // /users/profile
  {
    method: "GET",
    url: "/users/profile",
    schema: usersValidation.userById,
    preValidation: authenticateUser,
    handler: userController.userById,
    config: {
      description: "Retrieve user's own information"
    }
  },
  {
    method: "PUT",
    url: "/users/profile",
    schema: usersValidation.updateUser,
    preValidation: authenticateUser,
    handler: userController.updateUser,
    config: {
      description: "User edit his own profile"
    }
  },
  {
    method: "PUT",
    url: "/users/profile/credentials",
    schema: usersValidation.updateCredentials,
    preValidation: authenticateUser,
    handler: userController.updateCredentials,
    config: {
      description: "Update user's own email and/or password"
    }
  },
  {
    method: "GET",
    url: "/users/:id",
    schema: usersValidation.userById,
    preValidation: authenticateUser,
    preHandler: checkAdminRole,
    handler: userController.userById,
    config: {
      description: "Retrieve user by id",
    },
  },
  {
    method: "PUT",
    url: "/users/:id",
    schema: usersValidation.updateUser,
    preValidation: authenticateUser,
    preHandler: checkAdminRole,
    handler: userController.updateUser,
    config: {
      description: "Update user by id",
    },
  },
  {
    method: "DELETE",
    url: "/users/:id",
    schema: usersValidation.deleteUser,
    preValidation: authenticateUser,
    preHandler: checkAdminRole,
    handler: userController.deleteUser,
    config: {
      description: "Delete user by id",
    },
  },
];