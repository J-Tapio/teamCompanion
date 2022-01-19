import { Model } from "objection";

class UserActivities extends Model {
  static get tableName() {
    return "user_activities";
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
      required: ["athlete_id", "activity_id", "activity_start", "activity_end", "created_by"],
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        activityId: { type: "integer" },
        activityStart: { type: "string", format: "date-time" },
        activityEnd: { type: "string", format: "date-time" },
        rpeValue: {type: "integer", minValue: 1, maxValue: 10 },
        createdBy: { type: "integer" },
      }
    }
  }
}

export default UserActivities;