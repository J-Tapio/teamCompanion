import venueSchemas from "../controllers/validationSchemas/venues.schema.js";
import validationHandlers from "../controllers/preValidation/preValidators.js";
import preHandlers from "../controllers/preHandlers/preHandlers.js";
import venueHandlers from "../controllers/venues.controller.js";
const { authenticateUser } = validationHandlers;
const { checkActivitiesPriviledge } = preHandlers;

export default [
  {
    method: "GET",
    url: "/venues/team/:teamId/venues",
    schema: venueSchemas.allTeamVenues,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: venueHandlers.allTeamVenues,
    config: {
      description: "Retrieve created venues of team",
    },
  },
  {
    method: "POST",
    url: "/venues/team/:teamId/venues",
    schema: venueSchemas.createTeamVenue,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: venueHandlers.createTeamVenue,
    config: {
      description: "Create new venue for team",
    },
  },
  {
    method: "PUT",
    url: "/venues/team/:teamId/venue/:venueId",
    schema: venueSchemas.updateTeamVenue,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: venueHandlers.updateTeamVenue,
    config: {
      description: "Update team venue",
    },
  },
  {
    method: "DELETE",
    url: "/venues/team/:teamId/venue/:venueId",
    schema: venueSchemas.deleteTeamVenue,
    preValidation: authenticateUser,
    preHandler: checkActivitiesPriviledge,
    handler: venueHandlers.deleteTeamVenue,
    config: {
      description: "Delete team venue",
    },
  },
];
