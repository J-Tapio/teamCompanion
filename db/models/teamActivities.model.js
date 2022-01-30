import objection from "objection";
import { Model } from "objection";
import ActivityTypes from "./activityTypes.model.js";
import Venues from "./venues.model.js";
import UserTeams from "./userTeams.model.js";
import UserTeamActivities from "./userTeamActivities.model.js";
import Teams from "./teams.model.js";

class TeamActivities extends Model {
  static get tableName() {
    return "teamActivities";
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    //! Check that values are before insert truly in ISO8601 format
    //! NOT JUST DATE!
    // Hacky solution to verify if just date provided.
    // Moment.js has one function to do this but import for just one function??
    if(this.activityStart.length === 10 && this.activityEnd.length === 10) {
      throw new objection.ValidationError({
        message: "Only Date provided. Will end up with false information inserted on db implicitly.",
        type: "DateTime without time provided.",
        data: {
          activityStart: this.activityStart,
          activityEnd: this.activityEnd
        }
      });
    }
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["teamId", "createdBy", "activityTypeId", "venueId", "activityStart", "activityEnd"],
      properties: {
        id: { type: "integer" },
        teamId: { type: "integer" },
        createdBy: { type: "integer" },
        activityTypeId: { type: "integer" },
        opponentName: { type: ["string", "null"] },
        opponentLogo: { type: ["string", "null"] },
        activityNotes: { type: "string" },
        venueId: { type: "integer" },
        activityStart: { type: "string" },
        activityEnd: { type: "string" },
        updatedBy: { type: ["integer", "null"] }
      }
    }
  }

  static get relationMappings() {
    return {
      venue: {
        relation: Model.HasOneRelation,
        modelClass: Venues,
        join: {
          from: "teamActivities.venueId",
          to: "venues.id"
        }
      },
      activityTypes: {
        relation: Model.HasOneRelation,
        modelClass: ActivityTypes,
        join: {
          from: "teamActivities.activityTypeId",
          to: "activityTypes.id"
        }
      },
      userTeamsCreatedBy: {
        relation: Model.HasOneRelation,
        modelClass: UserTeams,
        join: {
          from: "teamActivities.createdBy",
          to: "userTeams.id"
        }
      },
      team: {
        relation: Model.HasOneRelation,
        modelClass: Teams,
        join: {
          from: "teamActivities.teamId",
          to: "teams.id"
        }
      },
      userTeamActivities: {
        relation: Model.ManyToManyRelation,
        modelClass: UserTeams,
        join: {
          from: "teamActivities.id",
          through: {
            from: "userTeamActivities.teamActivityId",
            to: "userTeamActivities.userTeamId"
          },
          to: "userTeams.id"
        }
      }
    }
  }
}

export default TeamActivities;