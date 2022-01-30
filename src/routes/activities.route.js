import validationHandlers from "../controllers/preValidation/preValidators.js";
import preHandlers from "../controllers/preHandlers/preHandlers.js";
import activitiesHandlers from "../controllers/activities.controller.js"
import activitiesSchemas from "../controllers/validationSchemas/activities.schema.js";
const { authenticateUser } = validationHandlers;
const { checkActivitiesPriviledge } = preHandlers;

//TODO: Query parameters.

export default [
  {
    method: "GET",
    url: "/activities/team/:teamId",
    schema: activitiesSchemas.allTeamActivities,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.allTeamActivities,
    config: {
      description: "Retrieve created activities of the team",
    },
  },
  {
    method: "GET",
    url: "/activities/team/:teamId/activity/:activityId",
    schema: activitiesSchemas.teamActivityById,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.teamActivityById,
    config: {
      description: "Retrieve activity by id",
    },
  },
  {
    method: "GET",
    url: "/activities/team/:teamId/member/:userTeamId",
    schema: activitiesSchemas.teamActivitiesByUserTeamId,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.teamActivitiesByUserTeamId,
    config: {
      description: "Retrieve athlete activities",
    },
  },
  {
    method: "POST",
    url: "/activities/team/:teamId",
    schema: activitiesSchemas.createTeamActivity,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.createTeamActivity,
    config: {
      description: "Create activity for team",
    },
  },
  {
    method: "PUT",
    url: "/activities/team/:teamId/activity/:activityId",
    schema: activitiesSchemas.updateTeamActivity,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.updateTeamActivity,
    config: {
      description: "Update team activity by id",
    },
  },
  {
    method: "DELETE",
    url: "/activities/team/:teamId/activity/:activityId",
    schema: activitiesSchemas.deleteTeamActivity,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.deleteTeamActivity,
    config: {
      description: "Delete team activity by id",
    },
  },
  {
    method: "POST",
    url: "/activities/team/:teamId/activity/:activityId/participants",
    schema: activitiesSchemas.insertActivityParticipants,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.insertActivityParticipants,
    config: {
      description: "Add participant(s) to team activity",
    },
  },
  {
    method: "PUT",
    url: "/activities/team/:teamId/activity/:activityId/participants",
    schema: activitiesSchemas.deleteActivityParticipants,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.deleteActivityParticipants,
    config: {
      description: "Delete participant(s) from team activity",
    },
  },
];