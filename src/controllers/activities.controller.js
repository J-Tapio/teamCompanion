import errorHandler from "../tools/dbErrors.js";
import TeamActivities from "../../db/models/teamActivities.model.js";
import dbResultHandlers from "../controllers/dbResultHandlers/activities.js";
import UserTeams from "../../db/models/userTeams.model.js";
import UserTeamActivities from "../../db/models/userTeamActivities.model.js";
import ExerciseSets from "../../db/models/exerciseSets.model.js";
import dbFitnessResultHandlers from "../controllers/dbResultHandlers/exerciseSets.js";


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
      // throwIfNotFound method invalid as it will not throw error
      // Query returns matches, hence the check for length equality:
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


function teamFitnessQuery() {
  return ExerciseSets.query()
      .select(
        "exerciseSets.id as exerciseSetId",
        "userTeamActivitiesId",
        "userTeamId",
        "firstName",
        "lastName",
        "teamRole",
        "exercisesEquipmentId",
        "exercises.exerciseName",
        "equipment.equipmentName",
        "assignedExWeight",
        "assignedExRepetitions",
        "assignedExDuration",
        "assignedExDistance",
        "assignedExVariation",
        "assignedSetDone",
        "assignedSetDonePartially",
        "completedExWeight",
        "completedExRepetitions",
        "completedExDuration",
        "completedExDistance",
        "completedExSetNotes",
        "rpeValue"
      )
      //.where("userTeams.teamId", request.params.teamId)
      .orderBy("userTeamActivities.id")
      .orderBy("exerciseSets.id")
      .joinRelated({
        userTeamActivities: true,
        exercisesEquipment: true,
      })
      .innerJoin(
        "userTeams",
        "userTeamActivities.userTeamId",
        "=",
        "userTeams.id"
      )
      .innerJoin(
        "userInformation",
        "userInformation.userId",
        "=",
        "userTeams.userId"
      )
      .innerJoin(
        "exercises",
        "exercisesEquipment.exerciseId",
        "=",
        "exercises.id"
      )
      .innerJoin(
        "equipment",
        "exercisesEquipment.equipmentId",
        "=",
        "equipment.id"
      );
}

async function allTeamFitnessData(request, reply) {
  try {
    // Retrieve all exercise sets related to fitness activity.
    let allTeamFitnessQuery = teamFitnessQuery().modify((baseQuery) => {
      baseQuery.where("userTeams.teamId", request.params.teamId)
    });

    let data = dbFitnessResultHandlers
    .allTeamFitnessData(await allTeamFitnessQuery);

    reply.send({data})
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function fitnessByAthleteId(request, reply) {
  try {
    let fitnessByTeamMemberQuery = teamFitnessQuery().modify((baseQuery) => {
      baseQuery.where("userTeams.teamId", request.params.teamId)
      .andWhere("userTeams.id", request.params.userTeamId)
      .throwIfNotFound();
    });

    let data = dbFitnessResultHandlers.allTeamFitnessData(
      await fitnessByTeamMemberQuery
    );

    reply.send({data});

  } catch (error) {
    errorHandler(error, reply);
  }
}

async function fitnessByActivityId(request, reply) {
  try {
    let query = teamFitnessQuery().modify((baseQuery) => {
      baseQuery.where("userTeams.teamId", request.params.teamId)
      .andWhere("userTeamActivities.teamActivityId", request.params.activityId)
      .throwIfNotFound()
    })

    let data = dbFitnessResultHandlers.allTeamFitnessData(
      await query
    );

    reply.send({data});
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function fitnessByUserTeamActivityId(request, reply) {
  try {
    let query = teamFitnessQuery().modify((baseQuery) => {
      baseQuery
        .where("userTeams.teamId", request.params.teamId)
        .andWhere("userTeamActivities.userTeamId", request.params.userTeamId)
        .andWhere(
          "userTeamActivities.teamActivityId",
          request.params.activityId
        )
        .throwIfNotFound();
    });

    let data = dbFitnessResultHandlers.exerciseSetsByActivityAndTeamMember(
      await query
    );

    reply.send(data);
  } catch (error) {
    errorHandler(error, reply);
  }
}

// Helper function for create & update
async function checkRequestIdsAgainstDB(data, activityId) {
  // Verify that within batch of data, the userTeamActivitiesId & activityId is found within UserTeamActivities table
    // From request body data, extract distinct userTeamActivitiesIds:
    let requestIds = data.reduce((acc, currentVal) => {
      if(acc.length > 0 && acc[acc.length-1][0][0] === currentVal.userTeamActivitiesId) {
        return acc;
      } else {
        acc.push([currentVal.userTeamActivitiesId, parseInt(activityId)])
        return acc;
      }
    },[])

    // Find matching rows from userTeamActivities table:
    let dbRowMatches = await UserTeamActivities.query()
    .whereIn(["id", "teamActivityId"], requestIds)
    .select("id");

    console.log(requestIds.length, dbRowMatches.length);
    // .throwIfNotFound() not possible method as query ignores unknown records, 
    // check for array length equality, eg [1] === [[2,2]]:
    if(dbRowMatches.length !== requestIds.length) {
      return false;
    } else {
      return true;
    }
}

async function createExerciseSets(request, reply) {
  try {
    let {data} = request.body;
    let {activityId} = request.params;
    // Verify that unknown id's not provided within request data
    if(!await checkRequestIdsAgainstDB(data, activityId)) {
      reply.badRequest();
    } else {
      // Batch insert:
      let trx = await ExerciseSets.startTransaction();
      let createdExerciseSets;
        try {
          createdExerciseSets = await ExerciseSets.query()
              .insert(data)
              .returning("*")
          await trx.commit();
        } catch (error) {
          await trx.rollback();
          reply.badRequest();
        }
      reply.status(201).send({ data: createdExerciseSets })
    }
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function modifyExerciseSets(request, reply) {
  try {
    // Update one or multiple assigned exercise set(s)
    // Delete one or multiple assigned exercise set(s)
    let {data} = request.body;

    if(
      data.length > 0 
      && 
      typeof data[0] === "object" 
      && 
      typeof data[0] !== "null"
      ) {
      // Request is meant to be update of DB records
      // Verify that unknown id's not provided within request data
      await matchRequestIdsWithExistingTableIds(request, reply);

      // Update exercise set(s)
      let trx = await ExerciseSets.startTransaction();
      try {
        let updatedExerciseSets=[];

        data.forEach(async (exerciseSet) => {
          const { userTeamActivitiesId, ...updateInformation } = exerciseSet;
          let updatedExerciseSet = await ExerciseSets.query().patch(updateInformation);
          updatedExerciseSets.push(updatedExerciseSet);
          await trx.commit();
        });

        reply.send({data: updatedExerciseSets})
      } catch (error) {
        await trx.rollback();
        reply.badRequest();
      }
    } else {
      // Delete exercise set(s)
      let trx = await ExerciseSets.startTransaction();
      try {
        await ExerciseSets.query().del().whereIn("id", data);
        await trx.commit();
      } catch (error) {
        await trx.rollback();
        reply.badRequest();
      }
      reply.status(204).send();
    }
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
  allTeamFitnessData,
  fitnessByAthleteId,
  fitnessByActivityId,
  fitnessByUserTeamActivityId,
  createExerciseSets,
  modifyExerciseSets
}