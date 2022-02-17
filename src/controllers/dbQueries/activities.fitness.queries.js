import FitnessQueryFormatter from "../dbResultFormatters/activities.fitness.resultformatter.js";
import ExerciseSets from "../../../db/models/exerciseSets.model.js";
import UserTeamActivities from "../../../db/models/userTeamActivities.model.js";
import AppError from "../../lib/appError.js";

export default class FitnessQueries {
    static #teamFitnessQuery() {
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
      )
  }

  static async allTeamFitnessData({teamId}) {
    // Retrieve all exercise sets related to fitness activity.
    let baseQuery = this.#teamFitnessQuery();
    let dbQuery = baseQuery
      .modify((baseQuery) => {
        baseQuery.where("userTeams.teamId", teamId);
      });

    let allTeamFitnessActivities = await dbQuery;
    return FitnessQueryFormatter
      .allTeamFitnessData(allTeamFitnessActivities);
  }

  static async fitnessByAthleteId({teamId, userTeamId}) {
    let baseQuery = this.#teamFitnessQuery();
    let dbQuery = baseQuery.modify((baseQuery) => {
      baseQuery
        .where("userTeams.teamId", teamId)
        .andWhere("userTeams.id", userTeamId)
        .throwIfNotFound();
    });

    let teamMemberFitnessActivities = await dbQuery;
    return FitnessQueryFormatter
      .allTeamFitnessData(teamMemberFitnessActivities);
  }

  static async fitnessByActivityId({teamId, activityId}) {
    let baseQuery = this.#teamFitnessQuery();
    let dbQuery = baseQuery.modify((baseQuery) => {
      baseQuery
        .where("userTeams.teamId", teamId)
        .andWhere(
          "userTeamActivities.teamActivityId",
          activityId
        )
        .throwIfNotFound();
    });
    
    let fitnessSessionInformation = await dbQuery;
    return FitnessQueryFormatter
      .allTeamFitnessData(fitnessSessionInformation);
  }

  static async fitnessByUserTeamActivityId({teamId, activityId, userTeamId}) {
    let baseQuery = this.#teamFitnessQuery();
    let dbQuery = baseQuery.modify((baseQuery) => {
      baseQuery
        .where("userTeams.teamId", teamId)
        .andWhere("userTeamActivities.userTeamId", userTeamId)
        .andWhere(
          "userTeamActivities.teamActivityId",
          activityId
        )
        .throwIfNotFound();
    });

    let teamMemberFitnessSessionInformation = await dbQuery;
    return FitnessQueryFormatter
      .exerciseSetsByActivityAndTeamMember(teamMemberFitnessSessionInformation);
  }

  static async #requestIdsExistOnDb(data, activityId) {
    // Verify that activityId & userTeamActivityId pair exists in join table
    let requestIds = data.reduce((acc, currentVal) => {
      if (
        acc.length > 0 &&
        acc[acc.length - 1][0] === currentVal.userTeamActivitiesId
      ) {
        return acc;
      } else {
        acc.push([currentVal.userTeamActivitiesId, activityId]);
        return acc;
      }
    }, []);

    let dbIdMatches = await UserTeamActivities.query()
      .whereIn(["id", "teamActivityId"], requestIds)
      .select("id");

    if(requestIds.length !== dbIdMatches.length) {
      throw new AppError("DB id matches unequal with payload data");
    }
  }

  static async createExerciseSets({data, activityId}) {
    // Verify that unknown id's not provided within request data
    await this.#requestIdsExistOnDb(data, activityId);
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
        throw new AppError("DB Transaction failed");
      }
    return {data: createdExerciseSets};
  }

  static async #batchExerciseSetsUpdate(data) {
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
      throw new AppError("DB Transaction failed");
    }
  }

  static async #deleteExerciseSets(data) {
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
      /**
       * In overall better to return just badRequest error?
       * Even in the case where one single deletion fails by unknown id?
       */
      throw new AppError("DB Transaction failed");
    }
  }

  static async modifyExerciseSets({data, activityId}) {
    // Data array of objects:
    if (
      data.length > 0 &&
      typeof data[0] === "object" &&
      typeof data[0] !== "null"
    ) {
      // Verify that unknown id's not provided within request data
      await this.#requestIdsExistOnDb(data, activityId);

      await this.#batchExerciseSetsUpdate(data);
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

      return {data: updatedExerciseSets};
    } else if (data.length > 0 && typeof data[0] === "number") {
      /**
      * Delete exercise set(s) by id(s)
      * id int
      * Data id[]
      */
      await this.#deleteExerciseSets(data);
    }
  }


  static async #validateCompletedExerciseSetsData(data) {
    return data.map(async (exerciseSet) => {
      let { id, ...updateInformation } = exerciseSet;
      // ExerciseSet data cannot contain both properties,
      // assignedSetDone && assignedSetDonePartially
      if (
        updateInformation.assignedSetDone === "true" &&
        updateInformation.assignedSetDonePartially === "true"
      ) {
        throw new AppError(
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
        throw new AppError("Trying to update wrong exercise set information");
      } else if (
        assignedExercise.assignedExDuration &&
        !exerciseSet.completedExDuration
      ) {
        throw new AppError("Trying to update wrong exercise set information");
      } else if (
        assignedExercise.assignedExDistance &&
        !exerciseSet.completedExDistance
      ) {
        throw new AppError("Trying to update wrong exercise set information");
      } else {
        return ExerciseSets.query()
          .patch(updateInformation)
          .where("id", id)
          .throwIfNotFound();
      }
    });
  }

  static async #dbPatchCompletedExerciseSets(data) {
    let exerciseSetsToUpdate = await this.#validateCompletedExerciseSetsData(data);

    let trx = await ExerciseSets.startTransaction();
    try {
      await Promise.all(exerciseSetsToUpdate);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new AppError("DB Transaction failed");
    }
  }

  static async #checkForMissingPayloadIds(data) {
    //1. Check for missing id and/or userTeamActivitiesId within data
    let requestIdsForUpdate = data.map((exerciseSet) => {
      if (exerciseSet.id && exerciseSet.userTeamActivitiesId) {
        return [exerciseSet.id, exerciseSet.userTeamActivitiesId];
      } else {
        throw new AppError(
          "Sent data is missing exercise set id and/or userTeamActivitiesId"
        );
      }
    });
    //2. Check that request data id & userTeamActivitiesId pairs exist within
    // DB records
    let dbMatches = await ExerciseSets.query()
      .select("id")
      .whereIn(["id", "userTeamActivitiesId"], requestIdsForUpdate); 
    // .throwIfNotFound() not possible to use for this query.
    // Hence, check for length equality
    if(data.length !== dbMatches.length) {
      throw new AppError("DB id matches unequal with payload data for exercise sets");
    }
  }

  static async assignedExerciseSetsCompleted({data}) {
    // Update all exercise sets as done for userTeamActivity.
    await ExerciseSets.query()
      .patch({ assignedSetDone: data[0].assignedSetDone })
      .where("userTeamActivitiesId", data[0].userTeamActivitiesId)
      .throwIfNotFound();
      
    return "Succesfully updated all exercise sets as done.";
  }

  static async updateCompletedExerciseSets({activityId, userTeamRole, data}) {
    /**
     * Validate payload Ids by matching them against existing DB records.
     * Throw error if payload data property assignedSetDone true,
     * and contains other properties than id
     * Transaction update. Rollback if even one fails within batch.
     * Return only status if request by Athlete, otherwise detailed information.
     */
    await this.#requestIdsExistOnDb(data, activityId);
    this.#checkForMissingPayloadIds(data);
    // Update assigned exercise set(s)
    await this.#dbPatchCompletedExerciseSets(data);
    // Return more data if teamRole is other than athlete
    if (userTeamRole !== "Athlete") {
      let updatedExerciseSetIds = data.map(exerciseSet => exerciseSet.id);
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
        .whereIn("id", updatedExerciseSetIds);

      return {data: updatedExerciseSets};
    } else {
      return "Updated successfully";
    }
  }
}