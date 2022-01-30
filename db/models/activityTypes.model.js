import { Model } from "objection";

class ActivityTypes extends Model {
  static get tableName() {
    return "activityTypes";
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
      required: ["activity_type", "createdBy"],
      properties: {
        id: { type: "integer" },
        activityType: { type:"string" },
        createdBy: { type: "integer" }
      },
    };
  }
}

export default ActivityTypes;
