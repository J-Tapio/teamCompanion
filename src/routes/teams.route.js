import teamsHandler from "../controllers/teams.controller.js";
import teamsSchema from "../controllers/validationSchemas/teams.schema.js";
import preHandlers from "../controllers/preHandlers/preHandlers.js";
import validationHandlers from "../controllers/preValidation/preValidators.js";
const { authenticateUser } = validationHandlers;
const { checkAdminRole, checkStaffAdminRole, checkResourceCreator } =
  preHandlers;

export default [
  {
    method: "GET",
    url: "/teams",
    schema: teamsSchema.allTeams,
    preValidation: authenticateUser,
    preHandler: checkAdminRole,
    handler: teamsHandler.getAllTeams,
    config: {
      description: "Retrieve all teams",
    },
  },
  {
    method: "POST",
    url: "/teams/register",
    schema: teamsSchema.createTeam,
    preValidation: authenticateUser,
    handler: teamsHandler.createTeam,
    config: {
      description: "Create new team",
    },
  },
  {
    method: "GET",
    url: "/teams/me",
    preValidation: authenticateUser,
    handler: teamsHandler.usersTeams,
    config: {
      description: "Retrieve teams where authenticated user is a member",
    },
  },
  {
    method: "GET",
    url: "/teams/:id",
    schema: teamsSchema.teamById,
    preValidation: authenticateUser,
    preHandler: checkStaffAdminRole,
    handler: teamsHandler.teamById,
    config: {
      description: "Retrieve team information by team id",
    },
  },
  {
    method: "PUT",
    url: "/teams/:id",
    schema: teamsSchema.updateTeam,
    preValidation: authenticateUser,
    preHandler: checkStaffAdminRole,
    handler: teamsHandler.updateTeam,
    config: {
      description: "Update team information by team id",
    },
  },
  {
    method: "DELETE",
    url: "/teams/:id",
    schema: teamsSchema.deleteTeam,
    preValidation: authenticateUser,
    preHandler: checkResourceCreator,
    handler: teamsHandler.deleteTeam,
    config: {
      description: "Delete team by team id",
    },
  },
];
