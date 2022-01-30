import errorHandler from "../tools/dbErrors.js";
import TeamActivities from "../../db/models/teamActivities.model.js";
import dbResultHandlers from "../controllers/dbResultHandlers/activities.js";
import Venues from "../../db/models/venues.model.js";
import UserTeams from "../../db/models/userTeams.model.js";
import UserTeamActivities from "../../db/models/userTeamActivities.model.js";
import {transaction} from "objection";

//TODO: Refactor queries to separate files for routes.
//? Function, which returns the query result but also could receive
//? query conditions, which are taken into account when modifying query to final form before DB query.
function createdActivitiesQuery() {
  return TeamActivities.query()
    .select(
      "teamActivities.id",
      "teamActivities.activityTypeId",
      "activityTypes.activityType",
      "venue.id as venueId",
      "venue.venueName",
      "venue.streetAddress",
      "venue.zipCode",
      "venue.city",
      "venue.state",
      "venue.country",
      "teamActivities.activityStart",
      "teamActivities.activityEnd",
      "teamActivities.opponentName",
      "teamActivities.opponentLogo",
      "teamActivities.activityNotes",
      "teamActivities.createdBy as createdByUserTeamId",
      "staff.firstName as createdByFirstName",
      "staff.lastName as createdByLastName",
      "userTeamsCreatedBy.teamRole as createdByTeamRole",
      "teamActivities.createdAt",
      "teamActivities.updatedAt"
    )
    .joinRelated({
      venue: true,
      activityTypes: true,
      userTeamsCreatedBy: true,
    })
    .innerJoin(
      "userInformation as staff",
      "userTeamsCreatedBy.userId",
      "=",
      "staff.userId"
    )
}


  //? Not necessary good idea to show everything at once (participants)
  //? Provide only distinct created activities. All information available per
  //? request by activity id: 
  //! .modify((createdActivitiesQuery) => { conditions=>additional query})


async function allTeamActivities(request, reply) {
  try {
    let dbQuery = createdActivitiesQuery().modify((baseQuery) => {
      if(request.query.participants) {
        baseQuery
          .select(
            "userTeamActivities.id as participantUserTeamId",
            "participantUser.firstName as participantFirstName",
            "participantUser.lastName as participantLastName",
            "userTeamActivities.teamRole as participantTeamRole"
          )
          .joinRelated({ userTeamActivities: true })
          .innerJoin(
            "userInformation as participantUser",
            "userTeamActivities.userId",
            "=",
            "participantUser.userId"
          )
          .orderBy("teamActivities.activityTypeId", "asc")
          .orderBy("activityStart", "asc")
          .orderBy("participantUserTeamId", "asc")
          .where("teamActivities.teamId", request.params.teamId)
          .throwIfNotFound();
      } else {
        baseQuery.distinct("teamActivities.id")
        .where("teamActivities.teamId", request.params.teamId)
        .throwIfNotFound();
      }
    })

    let data = request.query.participants ? 
    dbResultHandlers.teamActivitiesParticipants(await dbQuery) : 
    dbResultHandlers.teamActivities(await dbQuery);

    reply.send({data});
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function teamActivityById(request, reply) {
  try {

    let dbQuery = createdActivitiesQuery().modify((baseQuery) => {
      baseQuery
      .joinRelated({ userTeamActivities: true })
      .select(
        "userTeamActivities.id as participantUserTeamId",
        "participantUser.firstName as participantFirstName",
        "participantUser.lastName as participantLastName",
        "userTeamActivities.teamRole as participantTeamRole"
      )
      .innerJoin(
        "userInformation as participantUser",
        "userTeamActivities.userId",
        "=",
        "participantUser.userId"
      )
      .where("teamActivities.teamId", request.params.teamId)
      .andWhere("teamActivities.id", request.params.activityId)
      .throwIfNotFound();
    });

    reply.send(dbResultHandlers.teamActivityById(await dbQuery));
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function teamActivitiesByUserTeamId(request, reply) {
  try {
    let dbQuery = createdActivitiesQuery().modify((baseQuery) => {
      baseQuery
        .select(
          "userTeamActivities.id as participantUserTeamId",
          "participantUser.firstName as participantFirstName",
          "participantUser.lastName as participantLastName",
          "userTeamActivities.teamRole as participantTeamRole"
        )
        .joinRelated({ userTeamActivities: true })
        .innerJoin(
          "userInformation as participantUser",
          "userTeamActivities.userId",
          "=",
          "participantUser.userId"
        )
        .where("teamActivities.teamId", request.params.teamId)
        .andWhere("userTeamActivities.id", request.params.userTeamId)
        .orWhere("teamActivities.createdBy", request.params.userTeamId)
        .throwIfNotFound();
    })

    const data = dbResultHandlers.teamActivityByUserTeamId(await dbQuery);

    reply.send({data});
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createTeamActivity(request, reply) {
  try {
    const {
      id, 
      teamId, 
      createdBy, 
      activityTypeId, 
      opponentName, 
      opponentLogo, 
      activityNotes, 
      venueId, 
      activityStart, 
      activityEnd, 
      createdAt } = await TeamActivities.query()
      .insert({
        ...request.body,
        teamId: parseInt(request.params.teamId),
        createdBy: parseInt(request.user.userTeamId),
      })
      .returning("*")
    
    reply.status(201).send({
      id,
      teamId,
      createdBy,
      activityTypeId,
      opponentName,
      opponentLogo,
      activityNotes,
      venueId,
      activityStart,
      activityEnd,
      createdAt
    });
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateTeamActivity(request, reply) {
  try {
      let updatedActivity = await TeamActivities.query()
        .where({
          id: request.params.activityId,
          teamId: request.params.teamId
        })
        .patch({...request.body, updatedBy: request.user.userTeamId})
        .returning(
          "id",
          "teamId",
          "createdBy",
          "activityTypeId",
          "opponentName",
          "opponentLogo",
          "activityNotes",
          "venueId",
          "activityStart",
          "activityEnd",
          "updatedAt",
          "updatedBy",
        )
        .first()
        .throwIfNotFound();

    reply.send(updatedActivity)
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteTeamActivity(request, reply) {
  try {
    await TeamActivities.query()
    .del()
    .where("id", request.params.activityId)
    .throwIfNotFound();

    reply.status(204);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function insertActivityParticipants(request, reply) {
  try {
    // Check that participants part of the team:
    let teamMembers = request.body.data.map((participant) => [
      participant.userTeamId,
      parseInt(request.params.teamId),
    ]);

    let dbTeamMembers = await UserTeams.query()
      .whereIn(["id", "teamId"], teamMembers)
      .returning("id");
    //! Query returns matches, hence the check for length equality:
    if (teamMembers.length !== dbTeamMembers.length) {
      reply.notFound();
    }

    // Batch insert
    const trx = await UserTeamActivities.startTransaction();
    try {
      let activityParticipants = request.body.data.map((participant) => {
        return {
          userTeamId: participant.userTeamId,
          teamActivityId: parseInt(request.params.activityId),
        };
      });
      await UserTeamActivities.query(trx).insert(activityParticipants);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      reply.badRequest();
    }

    reply.status(201).send();
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteActivityParticipants(request, reply) {
  try {
      // Check that participants part of the team:
      let teamMembers = request.body.data.map((participant) => [
        participant.userTeamId,
        parseInt(request.params.teamId),
      ]);
      let dbTeamMembers = await UserTeams.query()
        .whereIn(["id", "teamId"], teamMembers)
        .returning("id");
      //! Query returns matches, hence the check for length equality:
      if(teamMembers.length !== dbTeamMembers.length) {
        reply.notFound();
      }

      // Batch deletion:
      let trx = await UserTeamActivities.startTransaction();
      try {
        let activityParticipants = request.body.data.map((participant) => [
          participant.userTeamId,
          parseInt(request.params.activityId),
        ]);
        await UserTeamActivities.query(trx)
          .del()
          .whereIn(["userTeamId", "teamActivityId"], activityParticipants);
        await trx.commit();
      } catch (error) {
        await trx.rollback();
        reply.badRequest();
      }

    reply.status(200).send();
  } catch (error) {
    errorHandler(error, reply);
  }
}

export default {
  allTeamActivities,
  teamActivityById,
  teamActivitiesByUserTeamId,
  createTeamActivity,
  updateTeamActivity,
  deleteTeamActivity,
  insertActivityParticipants,
  deleteActivityParticipants,
}