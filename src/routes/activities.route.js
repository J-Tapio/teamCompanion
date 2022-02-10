import validationHandlers from "../controllers/preValidation/preValidators.js";
import preHandlers from "../controllers/preHandlers/preHandlers.js";
import activitiesHandlers from "../controllers/activities.controller.js"
import activitiesSchemas from "../controllers/validationSchemas/activities.schema.js";
const { authenticateUser } = validationHandlers;
const { checkActivitiesPriviledge, checkForUnknownUrlIds } = preHandlers;

//TODO: Query parameters.

export default [
  {
    method: "GET",
    url: "/activities/team/:teamId",
    schema: activitiesSchemas.allTeamActivities,
    preValidation: authenticateUser,
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
    handler: activitiesHandlers.allTeamActivities,
    config: {
      description: "Retrieve created activities of the team",
    },
  },
  {
    method: "POST",
    url: "/activities/team/:teamId",
    schema: activitiesSchemas.createTeamActivity,
    preValidation: authenticateUser,
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
    handler: activitiesHandlers.createTeamActivity,
    config: {
      description: "Create activity for team",
    },
  },
  {
    method: "GET",
    url: "/activities/team/:teamId/activity/:activityId",
    schema: activitiesSchemas.teamActivityById,
    preValidation: authenticateUser,
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
    handler: activitiesHandlers.teamActivityById,
    config: {
      description: "Retrieve activity by id",
    },
  },
  {
    method: "GET",
    url: "/activities/team/:teamId/activity/fitness",
    schema: activitiesSchemas.allFitnessActivities,
    preValidation: authenticateUser,
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
    handler: activitiesHandlers.allTeamFitnessData,
    config: {
      description: "Retrieve all assigned fitness activities of team",
    },
  },
  {
    method: "GET",
    url: "/activities/team/:teamId/activity/fitness/:activityId",
    schema: activitiesSchemas.allFitnessActivities,
    preValidation: authenticateUser,
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
    handler: activitiesHandlers.fitnessByActivityId,
    config: {
      description:
        "Retrieve assigned user(s) and their exercises related to created fitness activity",
    },
  },
  {
    method: "GET",
    url: "/activities/team/:teamId/activity/fitness/member/:userTeamId",
    schema: activitiesSchemas.allFitnessActivities,
    preValidation: authenticateUser,
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
    handler: activitiesHandlers.fitnessByAthleteId,
    config: {
      description: "Retrieve fitness activities of a team member",
    },
  },
  {
    method: "GET",
    url: "/activities/team/:teamId/activity/:activityId/fitness/member/:userTeamId/exercises",
    schema: activitiesSchemas.fitnessByUserTeamActivityId,
    preValidation: authenticateUser,
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
    handler: activitiesHandlers.fitnessByUserTeamActivityId,
    config: {
      description:
        "Retrieve assigned exercises of fitness activity for a team member",
    },
  },
  {
    method: "PUT",
    url: "/activities/team/:teamId/activity/:activityId/fitness/member/:userTeamId/exercises",
    schema: activitiesSchemas.updateCompletedExerciseSets,
    preValidation: authenticateUser,
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
    handler: activitiesHandlers.updateCompletedExerciseSets,
    config: {
      description:
        "Update status for assigned exercise sets or update completed exercise values",
    },
  },
  {
    method: "POST",
    url: "/activities/team/:teamId/activity/fitness/:activityId",
    schema: activitiesSchemas.createExerciseSets,
    preValidation: authenticateUser,
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
    handler: activitiesHandlers.createExerciseSets,
    config: {
      description:
        "Assign exercise set(s), training program for team member in fitness activity",
    },
  },
  {
    method: "PUT",
    url: "/activities/team/:teamId/activity/fitness/:activityId",
    schema: activitiesSchemas.updateOrDeleteExerciseSets,
    preValidation: authenticateUser,
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
    handler: activitiesHandlers.modifyExerciseSets,
    config: {
      description:
        "Update / Delete exercise set(s) assigned to team member in fitness activity",
    },
  },
  {
    method: "GET",
    url: "/activities/team/:teamId/member/:userTeamId",
    schema: activitiesSchemas.teamActivitiesByUserTeamId,
    preValidation: authenticateUser,
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
    handler: activitiesHandlers.teamActivitiesByUserTeamId,
    config: {
      description: "Retrieve athlete activities",
    },
  },
  {
    method: "PUT",
    url: "/activities/team/:teamId/activity/:activityId",
    schema: activitiesSchemas.updateTeamActivity,
    preValidation: authenticateUser,
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
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
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
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
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
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
    preHandler: [checkForUnknownUrlIds, checkActivitiesPriviledge],
    handler: activitiesHandlers.deleteActivityParticipants,
    config: {
      description: "Delete participant(s) from team activity",
    },
  },
];