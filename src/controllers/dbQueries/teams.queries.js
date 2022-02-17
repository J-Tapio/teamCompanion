import Teams from "../../../db/models/teams.model.js";
import Venues from "../../../db/models/venues.model.js";
import UserTeams from "../../../db/models/userTeams.model.js";
import TeamsQueryFormatter from "../dbResultFormatters/teams.resultformatter.js";

export default class TeamsQueries extends TeamsQueryFormatter {
  static async allTeams() {
    return await Teams.query()
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
  }

  static async createTeam({userId, teamInformation, teamRole}) {
    // Create team
    let { id, updatedAt, ...newTeam } = await Teams.query()
      .insert({ ...teamInformation, createdBy: userId })
      .returning("*");

    // Create resource within join-table between team and creator of the team
    await UserTeams.query().insert({
      userId: userId,
      teamId: id,
      teamRole: teamRole,
      status: "Active",
    });

    return {id, ...newTeam};
  }

  static async userTeams({userId}) {
    return await Teams.query()
      .joinRelated("userTeams")
      .select(
        "user_teams_join.id as userTeamId",
        "teams.id as teamId",
        "teams.teamName",
        "teamRole"
      )
      .where("user_teams_join.userId", userId)
      .orderBy("teamId", "asc")
      .throwIfNotFound();
  }

  static async teamById({teamId}) {
    let dbResult = await Teams.query()
      .joinRelated("userTeams")
      .join(
        "userInformation",
        "user_teams_join.userId",
        "=",
        "userInformation.userId"
      )
      .where("teams.id", teamId)
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
        "user_teams_join.status"
      )
      .orderBy("userId", "asc")
      .throwIfNotFound();

    return this.formattedTeamInformation(dbResult);
  }

  static async updateTeam({id, updateInformation}) {
    return await Teams.query()
      .patchAndFetchById(id, updateInformation)
      .first()
      .throwIfNotFound();
  }

  static async deleteTeam({id}) {
    await Teams.query().deleteById(id).throwIfNotFound();
  }

  static async allTeamVenues({teamId}) {
    return await Venues.query().where("teamId", teamId);
  }

  static async createTeamVenue({teamId, teamInformation}) {
    let { updatedAt, ...newTeamVenue } = await Venues.query()
      .insert({ ...teamInformation, teamId })
      .returning("*");
    return newTeamVenue;
  }

  static async updateTeamVenue({id, teamId, updateInformation}) {
    return await Venues.query()
      .where({
        id,
        teamId
      })
      .patch(updateInformation)
      .returning(
        "id",
        "venueName",
        "streetAddress",
        "zipCode",
        "city",
        "state",
        "country",
        "teamId",
        "updatedAt"
      )
      .first()
      .throwIfNotFound();
  }

  static async deleteTeamVenue({id, teamId}) {
    console.log(id, teamId)
    await Venues.query()
      .del()
      .where({ id, teamId })
      .throwIfNotFound();
  }
}
