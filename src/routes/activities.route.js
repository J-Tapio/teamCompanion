import validationHandlers from "../controllers/preValidation/preValidators.js";
import preHandlers from "../controllers/preHandlers/preHandlers.js";
import activitiesHandlers from "../controllers/activities.controller.js"
import activitiesSchemas from "../controllers/validationSchemas/activities.schema.js";
import activitiesSchema from "../controllers/validationSchemas/activities.schema.js";
import activities from "../controllers/dbResultHandlers/activities.js";
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
    method: "GET", // Only staff members
    url: "/activities/team/:teamId/activity/fitness",
    schema: activitiesSchemas.allFitnessActivities,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.allTeamFitnessData,
    config: {
      description: "Retrieve all assigned fitness activities of team",
    },
  },
  {
    method: "GET", // All members, exception for athlete if part of activity!
    url: "/activities/team/:teamId/activity/fitness/:activityId",
    schema: activitiesSchemas.allFitnessActivities,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.fitnessByActivityId,
    config: {
      description:
        "Retrieve assigned user(s) and their exercises related to created fitness activity",
    },
  },
  {
    method: "GET", // All members, athlete only if userTeamId === athlete
    url: "/activities/team/:teamId/activity/fitness/member/:userTeamId",
    schema: activitiesSchema.allFitnessActivities,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.fitnessByAthleteId,
    config: {
      description: "Retrieve fitness activities of a team member",
    },
  },
  {
    method: "GET", // All members, athlete only if userTeamId === athlete
    url: "/activities/team/:teamId/activity/:activityId/fitness/member/:userTeamId/exercises",
    schema: activitiesSchema.fitnessByUserTeamActivityId,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.fitnessByUserTeamActivityId,
    config: {
      description:
        "Retrieve assigned exercises of fitness activity for a team member",
    },
  },
  {
    method: "POST", // Only trainer, coach, physio
    url: "/activities/team/:teamId/activity/fitness/:activityId",
    schema: activitiesSchema.createExerciseSets,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.createExerciseSets,
    config: {
      description:
        "Assign exercise set(s), training program for team member in fitness activity",
    },
  },
  {
    method: "PUT", // Only trainer, coach, physio
    url: "/activities/team/:teamId/activity/fitness/:activityId",
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: activitiesHandlers.modifyExerciseSets,
    config: {
      description:
        "Update exercise set(s) assigned to team member in fitness activity",
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