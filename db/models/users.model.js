import { Model } from "objection";
import UserInformation from "./userInformation.model.js";
import Teams from "./teams.model.js";

class Users extends Model {
  static get tableName() {
    return "users";
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
      required: ["email", "password"],
      properties: {
        id: { type: "integer" },
        email: { type: "string", minLength: 1, maxLength: 100 },
        emailStatus: {enum: ["pending", "active"]},
        password: { type: "string", minLength: 8, maxLength: 100 },
        role: { enum: ["admin", "user"] },
        refreshToken: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {
      teams: {
        relation: Model.ManyToManyRelation,
        modelClass: Teams,
        join: {
          from: "users.id",
          through: {
            from: "user_teams.user_id",
            to: "user_teams.team_id",
          },
          to: "teams.id",
        },
      },
      userInformation: {
        relation: Model.HasOneRelation,
        modelClass: UserInformation,
        join: {
          from: "users.id",
          to: "user_information.user_id"
        }
      }
    }
  };
}

export default Users;