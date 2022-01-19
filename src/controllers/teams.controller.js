import Teams from "../../db/models/teams.model.js";
import UserTeams from "../../db/models/userTeams.model.js";
import errorHandler from "../tools/dbErrors.js";
import dbResultHandler from "./dbResultHandlers/teams.js";

async function getAllTeams(request, reply) {
  try {
    const data = await Teams.query()
      .select(
        "id", 
        "teamName",
        "streetAddress",
        "city",
        "zipCode",
        "state",
        "country"
        )
      .orderBy("id", "asc")
      .throwIfNotFound();
    reply.send({count: data.length, data});
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createTeam(request, reply) {
  try {

    const {teamRole, ...teamProperties } = request.body;
    const {
      id, 
      teamName, 
      streetAddress, 
      city, 
      state, 
      zipCode, 
      country,
      createdAt
    } = await Teams.query()
    .insert({...teamProperties, createdBy: request.user.id})
    .returning("*");

    // Create resource within join-table between team and creator of the team
    await UserTeams.query()
    .insert({
      userId: request.user.id,
      teamId: id,
      teamRole: teamRole,
      status: "Active",
    })

    reply.status(201)
    .send({ 
      id, 
      teamName, 
      streetAddress, 
      city, 
      state, 
      zipCode, 
      country, 
      createdAt 
    });
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function usersTeams(request, reply) {
  try {
    const teams = await Teams.query()
      .joinRelated("userTeams")
      .select(
        "teams.id as teamId", 
        "teams.teamName",
        "teamRole"
      )
      .where("userId", request.user.id)
      .orderBy("teamId", "asc")
      .throwIfNotFound();
    reply.send({teams})
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function teamById(request, reply) {
  try {
    const team = await Teams.query()
      .joinRelated("userTeams")
      .join("userInformation", "user_teams_join.userId", "=", "userInformation.userId")
      .where("teams.id", request.params.id)
      .select(
        "teams.id as teamId",
        "teams.teamName",
        "teams.streetAddress",
        "teams.zipCode",
        "teams.city",
        "teams.state",
        "teams.country",
        "user_teams_join.userId as userId",
        "userInformation.firstName",
        "userInformation.lastName",
        "user_teams_join.teamRole",
        "user_teams_join.status",
      )
      .orderBy("userId", "asc")
      .throwIfNotFound();

    reply.send(dbResultHandler.teamInformation(team));
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateTeam(request, reply) {
  try {
    const updatedTeam = await Teams.query()
      .where("id", request.params.id)
      .patch(request.body)
      .returning(
        "id",
        "teamName", 
        "streetAddress",
        "city", 
        "state", 
        "zipCode", 
        "country",
        "updatedAt"
      )
      .first()
      .throwIfNotFound();

      reply.send(updatedTeam);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteTeam(request, reply) {
  try {
    await Teams.query().deleteById(request.params.id).throwIfNotFound();
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
  usersTeams
}