import { Model } from "objection";
import Teams from "./teams.model.js";

export default class TeamMembers extends Model {
  static get tableName() {
    return "team_members";
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
      required: ["email", "teamId"],
      properties: {
        id: { type: "integer" },
        email: { type: "string" },
        teamId: { type: "integer" },
        teamRole: {
          enum: ["Coach", "Physiotherapist", "Trainer", "Athlete", "Staff"],
        },
      },
    };
  }

  static get relationMappings() {
    return {
      teams: {
        relation: Model.BelongsToOneRelation,
        modelClass: Teams,
        join: {
          from: "team_members.teamId",
          to: "teams.id"
        }
      }
    }
  }
}