import validationHandlers from "../controllers/preValidation/preValidators.js";
import preHandlers from "../controllers/preHandlers/preHandlers.js";
import activitiesSchema from "../controllers/validationSchemas/activities.schema.js";
import userActivitiesHandler from "../controllers/activities.controller.js"
const { authenticateUser } = validationHandlers;
const { checkAdminRole } = preHandlers;

export default [

  { // All activities
    method: "GET",
    url: "/activities/team/:teamId", //TODO: Query params filtering later.
    schema: activitiesSchema.allTeamActivities,
    preValidation: authenticateUser,
    preHandler: , //! Coach / Trainer / Physio / Staff
    handler: userActivitiesHandler.allActivities,
    config: {
      description: "Retrieve activities of the team",
    },
  },
  {
    method: "GET",
    url: "/activities/team/:teamId/me", //User's assigned activities
    schema: ,
    preValidation: authenticateUser,
    preHandler: , //! Coach / Trainer / Physio / Staff
    handler: ,
    config: {
      description: "Retrieve assigned activities of user",
    },
  },
  {
    method: "GET",
    url: "/activities/team/:teamId/:athleteId",
    schema: activitiesSchema.teamActivityById,
    preValidation: authenticateUser,
    preHandler: , //! Coach / Trainer / Physio
    handler: ,
    config: {
      description: "Retrieve assigned activites of a user by id",
    },
  },
  {
    method: "POST",
    url: "/activities/team/:teamId",
    schema: activitiesSchema.newTeamActivity,
    preValidation: authenticateUser,
    preHandler: , //! Coach / Trainer / Physio
    handler: ,
    config: {
      description: "Create activity for team member(s)",
    },
  },
  {
    method: "PUT",
    url: "/activities/team/:teamId/:activityId",
    schema: activitiesSchema.updateTeamActivity,
    preValidation: authenticateUser,
    preHandler: , //! Coach / Trainer / Physio
    handler: ,
    config: {
      description: "Update assigned athlete activity",
    },
  },
  {
    method: "DELETE",
    url: "/activities/team/:teamId/:activityId",
    schema: activitiesSchema.deleteTeamActivity,
    preValidation: authenticateUser,
    preHandler: , //! Coach / Trainer / Physio
    handler: ,
    config: {
      description: "Delete ",
    },
  },
];