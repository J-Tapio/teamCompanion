import { Model } from "objection"
import countries from "../utils/countries.js";

class Venues extends Model {
  static get tableName() {
    return "venues";
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
        "venueName",
        "streetAddress",
        "zipCode",
        "city",
        "state",
        "country",
        "teamId"
      ],
      properties: {
        id: { type: "integer" },
        venueName: { type: "string" },
        streetAddress: { type: "string", minLength: 1, maxLength: 255 },
        city: { type: "string", minLength: 1, maxLength: 100 },
        state: { type: "string", minLength: 1, maxLength: 100 },
        zipCode: { type: "string", minLength: 1, maxLength: 100 },
        country: { enum: countries },
        teamId: { type: "integer" }
      },
    };
  }
}

export default Venues;