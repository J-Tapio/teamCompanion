import { Model } from "objection";

class Activity extends Model {
  static get tableName() {
    return "activities";
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
      required: ["userId", "activityType", "activityStart", "activityEnd"],
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        activityType: {
          enum: ["rehabilitation", "fitness", "teamPractice", "match"],
        },
        activityStart: { type: "date-time" },
        activityEnd: { type: "date-time" },
        rpeValue: {type: "integer", minValue: 1, maxValue: 10}
      },
    };
  }
}

export default Activity;
