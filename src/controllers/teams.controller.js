import Teams from "../../db/models/teams.model.js";
import UserTeams from "../../db/models/userTeams.model.js";
import Venues from "../../db/models/venues.model.js";
import errorHandler from "../lib/errorHandler.js";
import dbResultHandler from "./dbResultFormatters/teams.resultformatter.js";
import TeamsQueries from "../controllers/dbQueries/teams.queries.js";

async function getAllTeams(request, reply) {
  try {
    let data = await TeamsQueries.allTeams();
    reply.send({count: data.length, data});
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createTeam(request, reply) {
  try {
    let {teamRole, ...teamInformation} = request.body;
    let userId = request.user.id;
    let newTeam = await TeamsQueries.createTeam({
      userId,
      teamInformation,
      teamRole
    });

    reply.status(201).send(newTeam);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function usersTeams(request, reply) {
  try {
    let teams = await TeamsQueries.userTeams({
      userId: request.user.id
    });

    reply.send({teams});
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function teamById(request, reply) {
  try {
    let team = await TeamsQueries.teamById({
      teamId: parseInt(request.params.id)
    });
    reply.send(team);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateTeam(request, reply) {
  try {
    let updatedTeam = await TeamsQueries.updateTeam({
      id: parseInt(request.params.id),
      updateInformation: request.body,
    });

    reply.send(updatedTeam);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteTeam(request, reply) {
  try {
    await TeamsQueries.deleteTeam({
      id: parseInt(request.params.id)
    });
    reply.status(204);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function allTeamVenues(request, reply) {
  try {
    let data = await TeamsQueries.allTeamVenues({
      teamId: parseInt(request.params.id)
    });
    reply.send({ count: data.length, data });
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createTeamVenue(request, reply) {
  try {
    let newTeamVenue = await TeamsQueries.createTeamVenue({
      teamId: parseInt(request.params.id),
      teamInformation: request.body,
    });

    reply.status(201).send(newTeamVenue);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateTeamVenue(request, reply) {
  try {
    let updatedTeamVenue = await TeamsQueries.updateTeamVenue({
      id: parseInt(request.params.venueId),
      teamId: parseInt(request.params.id),
      updateInformation: request.body
    });

    reply.send(updatedTeamVenue);
  } catch (error) {
    console.log(error);
    errorHandler(error, reply);
  }
}

async function deleteTeamVenue(request, reply) {
  try {
    await TeamsQueries.deleteTeamVenue({
      id: parseInt(request.params.venueId), 
      teamId: parseInt(request.params.id)
    });
    
    reply.status(204);
  } catch (error) {
    errorHandler(error, reply);
  }
}

export default {
  getAllTeams,
  createTeam,
  teamById,
  updateTeam,
  deleteTeam,
  usersTeams,
  allTeamVenues,
  createTeamVenue,
  updateTeamVenue,
  deleteTeamVenue,
};