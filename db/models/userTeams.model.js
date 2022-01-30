import { Model } from "objection";
import UserTeamActivities from "./userTeamActivities.model.js";


class UserTeams extends Model {
  static get tableName() {
    return "userTeams";
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId", "teamId", "teamRole", "status"],
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        teamId: { type: "integer" },
        teamRole: {
          enum: ["Coach", "Physiotherapist", "Trainer", "Athlete", "Staff"],
        },
        status: { enum: ["Active", "Injured", "Inactive", "Vacation", "Sick"] },
      },
    };
  }

  static get relationMappings() {
    return {
      userTeamActivities: {
        relation: Model.HasOneThroughRelation,
        modelClass: UserTeamActivities,
        join: {
          from: "userTeams.id",
          through: {
            from: "userTeamActivities.userTeamId",
            to: "userTeamActivities.teamActivityId",
          },
          to: "teamActivities.id"
        }
      }
    }
  }
}

export default UserTeams;