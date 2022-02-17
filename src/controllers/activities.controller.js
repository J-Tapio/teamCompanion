import errorHandler from "../lib/errorHandler.js";
import ActivitiesQueries from "../controllers/dbQueries/activities.queries.js";
import FitnessQueries from "../controllers/dbQueries/activities.fitness.queries.js";


async function allTeamActivities(request, reply) {
  try {
    let teamActivities = await ActivitiesQueries.allTeamActivities({
      participants: request.query.participants || false,
      teamId: parseInt(request.params.teamId)
    });

    reply.send({data: teamActivities});
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function teamActivityById(request, reply) {
  try {
    let teamActivity = await ActivitiesQueries.teamActivityById({
      teamId: parseInt(request.params.teamId),
      activityId: parseInt(request.params.activityId)
    });

    reply.send(teamActivity);
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function teamActivitiesByUserTeamId(request, reply) {
  try {
    let teamMemberActivities = await ActivitiesQueries     
      .teamActivitiesByUserTeamId({
        teamId: parseInt(request.params.teamId),
        userTeamId: parseInt(request.params.userTeamId)
      });

    reply.send(teamMemberActivities);
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function createTeamActivity(request, reply) {
  try {
    let newTeamActivity = await ActivitiesQueries.createTeamActivity({
      teamId: parseInt(request.params.teamId),
      createdBy: request.user.userTeamId,
      data: request.body,
    });

    reply.status(201).send(newTeamActivity);
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function updateTeamActivity(request, reply) {
  try {
    let updatedTeamActivity = await ActivitiesQueries.updateTeamActivity({
      activityId: parseInt(request.params.activityId),
      teamId: parseInt(request.params.teamId),
      updatedBy: request.user.userTeamId,
      data: request.body
    });

    reply.send(updatedTeamActivity);
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function deleteTeamActivity(request, reply) {
  try {
    await ActivitiesQueries.deleteTeamActivity({
      teamId: parseInt(request.params.teamId),
      activityId: parseInt(request.params.activityId)
    });

    reply.status(204);
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function insertActivityParticipants(request, reply) {
  try {
    await ActivitiesQueries.insertActivityParticipants({
      teamId: parseInt(request.params.teamId),
      activityId: parseInt(request.params.activityId),
      data: request.body.data
    });

    reply.status(201).send();
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function deleteActivityParticipants(request, reply) {
  try {
    await ActivitiesQueries.deleteActivityParticipants({
      teamId: parseInt(request.params.teamId),
      activityId: parseInt(request.params.activityId),
      data: request.body.data
    });

    reply.status(200).send();
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function allTeamFitnessData(request, reply) {
  try {
    let data = await FitnessQueries.allTeamFitnessData({
      teamId: parseInt(request.params.teamId)
    });

    reply.send({data});
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function fitnessByAthleteId(request, reply) {
  try {
    let athleteFitnessActivities = await FitnessQueries.fitnessByAthleteId({
      teamId: parseInt(request.params.teamId),
      userTeamId: parseInt(request.params.userTeamId)
    });

    reply.send({data: athleteFitnessActivities});
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function fitnessByActivityId(request, reply) {
  try {
    let fitnessActivity = await FitnessQueries.fitnessByActivityId({
      teamId: parseInt(request.params.teamId),
      activityId: parseInt(request.params.activityId)
    })

    reply.send({data: fitnessActivity});
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function fitnessByUserTeamActivityId(request, reply) {
  try {
    let athleteExerciseSetsOfFitnessSession = await FitnessQueries
      .fitnessByUserTeamActivityId({
        teamId: parseInt(request.params.teamId),
        activityId: parseInt(request.params.activityId),
        userTeamId: parseInt(request.params.userTeamId)
      })

    reply.send(athleteExerciseSetsOfFitnessSession);
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function createExerciseSets(request, reply) {
  try {
    let createdExerciseSets = await FitnessQueries
      .createExerciseSets({
        activityId: parseInt(request.params.activityId),
        data: request.body.data
      });

    reply.status(201).send(createdExerciseSets)
  } catch (error) {
    errorHandler(error, reply);
  }
}


async function modifyExerciseSets(request, reply) {
  /**
   * Delete one or multiple assigned exercise set(s)
   * Update one or multiple assigned exercise set(s)
   */
  try {
    let activityId = parseInt(request.params.activityId);
    let {data} = request.body;
    if(data.length > 0 && typeof data[0] === "number") {
      // Exercise set deletion (single or multiple)
      await FitnessQueries.modifyExerciseSets({
        activityId,
        data,
      });

      reply.status(204).send();
    } else {
      // Exercise set update (single or multiple)
      let updatedExerciseSets = await FitnessQueries.modifyExerciseSets({
        activityId,
        data,
      });

      reply.send(updatedExerciseSets);
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
  try {
    let {data} = request.body;
    let activityId = parseInt(request.params.activityId);
    const userTeamRole = request.user.teamRole;

    if (
      data.length === 1 &&
      Object.keys(data[0]).length === 2 &&
      !data[0].id &&
      data[0].userTeamActivitiesId &&
      data[0].assignedSetDone
    ) { 
      // Mark every exercise set as done.
      let updateResult = await FitnessQueries.assignedExerciseSetsCompleted({
        data
      });

      reply.send({message: updateResult});
    } else {
      // Update only single/multiple assigned exercise set(s)
      let updateResult = await FitnessQueries.updateCompletedExerciseSets({
        activityId, 
        userTeamRole,
        data
      });

      /**
       * If request made by another than athlete, return updated exercise sets
       * For athlete, return just a message of successful update
       */
      if(updateResult.data) {
        reply.send(updateResult); 
      } else {
        reply.send({message: updateResult})
      }
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
  modifyExerciseSets,
  updateCompletedExerciseSets
}