import { Model } from "objection";
import Users from "./users.model.js";
import countries from "../utils/countries.js";

class UserInformation extends Model {
  static get tableName() {
    return "user_information";
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
        "firstName",
        "lastName",
        "dateOfBirth",
        "streetAddress",
        "city",
        "state",
        "zipCode",
        "country"
      ],
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        firstName: { type: "string", minLength: 1, maxLength: 100 },
        lastName: { type: "string", minLength: 1, maxLength: 100 },
        dateOfBirth: { type: "string" },
        streetAddress: { type: "string", minLength: 1, maxLength: 255 },
        city: { type: "string", minLength: 1, maxLength: 100 },
        state: { type: "string", minLength: 1, maxLength: 100 },
        zipCode: { type: "string", minLength: 1, maxLength: 100 },
        country: { enum: countries },
      }
    }
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.HasOneRelation,
        modelClass: Users,
        join: {
          from: "user_information.user_id",
          to: "users.id"
        }
      }
    }
  }

}

export default UserInformation;