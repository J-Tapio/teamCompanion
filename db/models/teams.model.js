import { Model } from "objection";
import countries from "../utils/countries.js";
import Users from "./users.model.js";

class Teams extends Model {
  static get tableName() {
    return "teams";
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
      required: [
      "teamName", 
      "streetAddress",
      "city", 
      "state", 
      "zipCode", 
      "country",
      "createdBy"
    ],
      properties: {
        id: { type: "integer" },
        teamName: { type: "string", minLength: 1, maxLength: 100 },
        streetAddress: { type: "string", minLength: 1, maxLength: 255 },
        city: { type: "string", minLength: 1, maxLength: 100 },
        state: { type: "string", minLength: 1, maxLength: 100 },
        zipCode: { type: "string", minLength: 1, maxLength: 100 },
        country: { enum: countries },
        createdBy: { type: "integer" },
        }
      }
  }

  static get relationMappings() {
    return {
      userTeams: {
        relation: Model.ManyToManyRelation,
        modelClass: Users,
        join: {
          from: "teams.id",
          through: {
            from: "user_teams.teamId",
            to: "user_teams.userId",
          },
          to: "users.id",
        },
      }
    }
  };
}

export default Teams;