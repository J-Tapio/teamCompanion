import validationHandlers from "../controllers/preValidation/preValidators.js";
import preHandlers from "../controllers/preHandlers/preHandlers.js";
const { authenticateUser } = validationHandlers;
const { checkAdminRole } = preHandlers;

export default [

  { // All activities
    method: "GET",
    url: "/activities/team/:teamId", //TODO: Query params filtering later.
    schema: ,
    preValidation: authenticateUser,
    preHandler: , //! Coach / Trainer / Physio / Staff
    handler: ,
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
      description: "Retrieve activities of the team",
    },
  },
  {
    method: "GET",
    url: "/activities/team/:teamId/:athleteId",
    schema: ,
    preValidation: authenticateUser,
    preHandler: , //! Coach / Trainer / Physio
    handler: ,
    config: {
      description: "",
    },
  },
  {
    method: "POST",
    url: "/activities/team/:teamId",
    schema: ,
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
    schema: ,
    preValidation: authenticateUser,
    preHandler: , //! Coach / Trainer / Physio
    handler: ,
    config: {
      description: "Retrieve user's team activities",
    },
  },
  {
    method: "DELETE",
    url: "/activities/team/:teamId/:activityId",
    schema: ,
    preValidation: authenticateUser,
    preHandler: , //! Coach / Trainer / Physio
    handler: ,
    config: {
      description: "Retrieve user's team activities",
    },
  },
];