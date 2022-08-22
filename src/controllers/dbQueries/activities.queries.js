import TeamActivities from "../../../db/models/teamActivities.model.js";
import UserTeams from "../../../db/models/userTeams.model.js";
import UserTeamActivities from "../../../db/models/userTeamActivities.model.js";
import AppError from "../../lib/appError.js";
import ActivitiesResultFormatter from "../dbResultFormatters/activities.resultformatter.js";

export default class ActivitiesQueries {
  
  static #createdActivitiesQuery() {
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
      );
  }

  
  static async allTeamActivities({participants, teamId}) {
    let baseQuery = this.#createdActivitiesQuery();
    let dbQuery = baseQuery.modify((baseQuery) => {
      if (participants) {
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
          .where("teamActivities.teamId", teamId)
          .throwIfNotFound();
      } else {
        baseQuery
          .distinct("teamActivities.id")
          .where("teamActivities.teamId", teamId)
          .throwIfNotFound();
      }
    });

    let data = participants
      ? ActivitiesResultFormatter
        .teamActivitiesParticipants(await dbQuery)
      : ActivitiesResultFormatter
        .teamActivities(await dbQuery);

    return data;
  }


  static async teamActivityById({teamId, activityId}) {
    let baseQuery = this.#createdActivitiesQuery()
    let dbQuery = baseQuery.modify((baseQuery) => {
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
        .where("teamActivities.teamId", teamId)
        .andWhere("teamActivities.id", activityId)
        .throwIfNotFound();
    });

    return ActivitiesResultFormatter
      .teamActivityById(await dbQuery);
  }


  static async teamActivitiesByUserTeamId({teamId, userTeamId}) {
      let baseQuery = this.#createdActivitiesQuery();
      let dbQuery = baseQuery.modify((baseQuery) => {
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
          .where("teamActivities.teamId", teamId)
          .andWhere("userTeamActivities.id", userTeamId)
          .orWhere("teamActivities.createdBy", userTeamId)
          .throwIfNotFound();
      });

      return ActivitiesResultFormatter
        .teamActivitiesByUserTeamId(await dbQuery);
  }


  static async createTeamActivity({teamId, createdBy, data}) {
    let {updatedAt, ...createdTeamActivity} = await TeamActivities.query()
      .insert({
        ...data,
        teamId,
        createdBy,
      })
      .returning("*");
    return createdTeamActivity;
  }


  static async updateTeamActivity({activityId, teamId, updatedBy, data}) {
    let updatedActivity = await TeamActivities.query()
      .where({
        id: activityId,
        teamId: teamId,
      })
      .patch({ ...data, updatedBy })
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
        "updatedBy"
      )
      .first()
      .throwIfNotFound();
    
    return updatedActivity;
  }


  static async deleteTeamActivity({teamId, activityId}) {
    await TeamActivities.query()
      .delete()
      .where({
        id: activityId,
        teamId
      })
      .throwIfNotFound();
  }

  
  static async #checkThatParticipantsPartOfTheTeam(teamId, data) {
    // Check that participants are part of the team:
    let teamMembers = data.map((participant) => [
      participant.userTeamId,
      teamId,
    ]);

    let dbTeamMembers = await UserTeams.query()
      .whereIn(["id", "teamId"], teamMembers)
      .select("id");

    // Query returns matches when comparing payload provided id's against existing id's in database, hence the check for length equality:
    if (teamMembers.length !== dbTeamMembers.length) {
      throw new AppError("DB id matches unequal with payload data");
    }
  }


  static async insertActivityParticipants({teamId, activityId, data}) {
    // Check that payload data userTeamId's exist in db
    await this.#checkThatParticipantsPartOfTheTeam(teamId, data);

    // Batch insert
    const trx = await UserTeamActivities.startTransaction();
    try {
      let activityParticipants = data.map((participant) => {
        return {
          userTeamId: participant.userTeamId,
          teamActivityId: activityId,
        };
      });
      await UserTeamActivities.query().insert(activityParticipants);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new AppError("DB Transaction failed")
    }
  }


  static async deleteActivityParticipants({teamId, activityId, data}) {
    await this.#checkThatParticipantsPartOfTheTeam(teamId, data);
    // Batch deletion:
    let trx = await UserTeamActivities.startTransaction();
    try {
      let activityParticipants = data.map((participant) => [
        participant.userTeamId,
        parseInt(activityId),
      ]);
      await UserTeamActivities.query()
        .del()
        .whereIn(["userTeamId", "teamActivityId"], activityParticipants);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new AppError("DB Transaction failed");
    }
  }
}
