import errorHandler from "../lib/errorHandler.js";
import TeamsQueries from "../controllers/dbQueries/teams.queries.js";
import imageUpload from "../lib/imageUpload.js";
import csv from "csvtojson";
import AppError from "../lib/appError.js";

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

async function uploadTeamLogo(request, reply) {
  try {
    let teamLogo = await imageUpload.teamLogo(request);
    await TeamsQueries.updateTeamLogo({
      teamLogo, 
      teamId: parseInt(request.params.id)
    });

    reply.status(201).send({image: teamLogo})
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

async function pendingTeamMemberActivations(request, reply) {
  try {
    let pendingActivations = await TeamsQueries
      .pendingTeamMemberActivations({
        teamId: parseInt(request.params.id),
      });
    reply.send(pendingActivations);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function addTeamMembers(request, reply) {
  try {
 /*    let data = request.body.data.map((obj) => {
      obj.teamId = parseInt(request.params.id)
      return obj;
    }) */
    let createdMemberToTeamLinks = await TeamsQueries.addTeamMembers({
      data: request.body.data,
      teamId: parseInt(request.params.id)
    });
    reply.status(201).send(createdMemberToTeamLinks);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function addTeamMembersCSV(request, reply) {
  try {
    let data = await request.file({limits: {filesize: 2500}});
    if(data.mimetype !== "text/csv") {
      throw new AppError("Mimetype not text/csv")
    }

    /**
     * Fastify-multipart has been set to have a limit of filesize, 2.5kbit
     * Considering CSV file with two columns, it would exceed filesize limit
     * with over 50-60 rows. Assumption here is that no one would not have an
     * organisation with over 50-60 members to add at once. 
     * At least team-wise!
     * Will save csv in json format to memory since it will be small in size.
     */

    let teamMembersCSV = await csv({trim: true}).fromStream(data.file);
    let createdTeamMembers = await TeamsQueries.addTeamMembers({
      data: teamMembersCSV,
      teamId: parseInt(request.params.id)
    });
    
    console.log(createdTeamMembers)

    reply.status(201).send(createdTeamMembers);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateTeamMember(request, reply) {
  try {
    let updatedMemberToTeamInfo = await TeamsQueries.updateTeamMember({
      linkedMemberId: parseInt(request.params.linkedMemberId),
      updateInformation: request.body,
    })
    reply.send(updatedMemberToTeamInfo);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteTeamMember(request, reply) {
  try {
    await TeamsQueries.deleteTeamMember({
      linkedMemberId: parseInt(request.params.linkedMemberId)
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
  uploadTeamLogo,
  teamById,
  updateTeam,
  deleteTeam,
  pendingTeamMemberActivations,
  addTeamMembers,
  addTeamMembersCSV,
  updateTeamMember,
  deleteTeamMember,
  usersTeams,
  allTeamVenues,
  createTeamVenue,
  updateTeamVenue,
  deleteTeamVenue,
};