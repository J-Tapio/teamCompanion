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

/**
 * Verify that activityId & userTeamActivityId pairs exist in db join table
 * Return boolean
 */
async function requestIdsExistOnDb(data, activityId, reply) {
  // Verify that activityId & userTeamActivityId pair exists in join table
  let requestIds = data.reduce((acc, currentVal) => {
    if(acc.length > 0 && acc[acc.length-1][0] === currentVal.userTeamActivitiesId) {
      return acc;
    } else {
      acc.push([currentVal.userTeamActivitiesId, parseInt(activityId)])
      return acc;
    }
  },[]);
  
  let dbIdMatches = await UserTeamActivities.query()
  .whereIn(["id", "teamActivityId"], requestIds)
  .select("id");

  console.log(dbIdMatches);

  if(requestIds.length === dbIdMatches.length) {
    return true;
  } else { 
    return false; 
  }
}

async function createExerciseSets(request, reply) {
  try {
    let {data} = request.body;
    let {activityId} = request.params;
    // Verify that unknown id's not provided within request data
    if(!await requestIdsExistOnDb(data, activityId)) {
      reply.notFound();
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
  /**
   * Update one or multiple assigned exercise set(s)
   * Delete one or multiple assigned exercise set(s)
   */
  try {
    let { data } = request.body;
    let { activityId } = request.params;
    // Data array of objects:
    if (
      data.length > 0 &&
      typeof data[0] === "object" &&
      typeof data[0] !== "null"
    ) {
      // Verify that unknown id's not provided within request data
      if (!(await requestIdsExistOnDb(data, activityId))) {
        reply.notFound();
      } else {
        await batchExerciseSetsUpdate(data);
        let updatedIds = data.map((exerciseSet) => exerciseSet.id);
        let updatedExerciseSets = await ExerciseSets.query()
          .select(
            "id",
            "userTeamActivitiesId",
            "exercisesEquipmentId",
            "assignedExWeight",
            "assignedExRepetitions",
            "assignedExDuration",
            "assignedExDistance",
            "assignedExVariation",
            "updatedAt"
          )
          .whereIn("id", updatedIds);
        reply.send({ data: updatedExerciseSets });

        async function batchExerciseSetsUpdate(data) {
          let trx = await ExerciseSets.startTransaction();
          try {
            // Update exercise set(s)
            await Promise.all(
              data.map((exerciseSet) => {
                let { id, ...updateInformation } = exerciseSet;
                return ExerciseSets.query()
                  .patch(updateInformation)
                  .where("id", id);
              })
            );
            await trx.commit();
          } catch (error) {
            await trx.rollback();
            reply.badRequest(error);
          }
        }
      }
    } else if (data.length > 0) {
      /**
       * Delete exercise set(s) by id(s)
       * id(integer)
       * Data [id, id,.]
       */
      await deleteExerciseSets(data);
      reply.status(204).send();

      async function deleteExerciseSets(data) {
        let trx = await ExerciseSets.startTransaction();
        try {
          await Promise.all(
            data.map((id) => {
              return ExerciseSets.query().deleteById(id).throwIfNotFound();
            })
          );
          await trx.commit();
        } catch (error) {
          await trx.rollback();
          //? Or should it be notFound()?
          reply.badRequest();
        }
      }
    }
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateCompletedExerciseSets(request, reply) {
  /**
   * Validate payload Ids by matching them against existing DB records.
   * Throw error if payload data property assignedSetDone true,
   * and contains other properties than id
   * Transaction update. Rollback if even one fails within batch.
   * Return only status if request by Athlete, otherwise detailed information.
   */

  let { data } = request.body;
  let { activityId } = request.params;

  if(
    data.length === 1 && 
    Object.keys(data[0]).length === 2 &&
    !data[0].id &&
    data[0].userTeamActivitiesId &&
    data[0].assignedSetDone
  ) {
      await ExerciseSets.query()
      .patch({assignedSetDone: data[0].assignedSetDone})
      .where("userTeamActivitiesId", data[0].userTeamActivitiesId).throwIfNotFound();

      reply.status(200)
      .send({message: "Successfully updated all exercise sets as done."});
  } else {
    if (!(await requestIdsExistOnDb(data, activityId))) {
      reply.notFound();
    }
    let requestIdsForUpdate = data.map((exerciseSet) => {
      if(exerciseSet.id && exerciseSet.userTeamActivitiesId) {
        return [exerciseSet.id, exerciseSet.userTeamActivitiesId]
      } else {
        reply.badRequest(
          "Sent data is missing id and/or userTeamActivitiesId"
          );
      }
  });
  
  
    let dbMatches = await ExerciseSets.query()
      .select("id")
      .whereIn(["id", "userTeamActivitiesId"], requestIdsForUpdate);
  
    if (data.length !== dbMatches.length) {
      reply.notFound();
    } else {

      async function dbPatchCompletedExerciseSets(data) {
        let exerciseSetsToUpdate = data.map(async (exerciseSet) => {
          let { id, ...updateInformation } = exerciseSet;
          // ExerciseSet data cannot contain both properties,
          // assignedSetDone && assignedSetDonePartially
          if (
            updateInformation.assignedSetDone === "true" &&
            updateInformation.assignedSetDonePartially === "true"
          ) {
            reply.badRequest(
              "Assigned exercise can be either done or partially completed"
            );
          }
          // For every exerciseSet, check assigned exerciseSet ?
          // Make sure that if exercisesEquipmentId === strength or cardio
          // then valid properties are being updated!
          let assignedExercise = await ExerciseSets.query()
            .select(
              "assignedExWeight",
              "assignedExRepetitions",
              "assignedExDuration",
              "assignedExDistance"
            )
            .where("id", id);

          if (
            assignedExercise.assignedExWeight &&
            assignedExercise.assignedExRepetitions && 
            !exerciseSet.completedExWeight && 
            !exerciseSet.completedExRepetitions
          ) {
            reply.badRequest(
              "Trying to update wrong exercise set information"
            );
          } else if (
            assignedExercise.assignedExDuration &&
            !exerciseSet.completedExDuration
          ) { 
            reply.badRequest(
              "Trying to update wrong exercise set information"
            );
          } else if (
            assignedExercise.assignedExDistance &&
            !exerciseSet.completedExDistance
          ) {
            reply.badRequest(
              "Trying to update wrong exercise set information"
            );
          } else {
            return ExerciseSets.query()
              .patch(updateInformation)
              .where("id", id)
              .throwIfNotFound();
          }
        });

        let trx = await ExerciseSets.startTransaction();
        try {
          await Promise.all(exerciseSetsToUpdate);
          await trx.commit();
        } catch (error) {
          console.log(error);
          await trx.rollback();
          reply.badRequest();
        }
      }

      await dbPatchCompletedExerciseSets(data);
      if (request.user.teamRole !== "Athlete") {
        let updatedExerciseSets = await ExerciseSets.query()
          .select(
            "id",
            "userTeamActivitiesId",
            "assignedSetDone",
            "assignedSetDonePartially",
            "completedExWeight",
            "completedExRepetitions",
            "completedExDuration",
            "completedExDistance",
            "completedExSetNotes",
            "updatedAt"
          )
          .orderBy("id")
          .whereIn(
            "id",
            data.map((exerciseSet) => exerciseSet.id)
          );
        reply.send({ data: updatedExerciseSets });
      } else {
        reply.status(200);
      }
  
    }
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
  modifyExerciseSets,
  updateCompletedExerciseSets
}