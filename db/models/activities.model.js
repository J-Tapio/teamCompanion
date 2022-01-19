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
      required: ["activity_type"],
      properties: {
        id: { type: "integer" },
        activityType: {
          enum: [
            "Rehabilitation", 
            "Fitness", 
            "TeamPractise", 
            "TeamMeeting", 
            "TeamMatch"
        ],
        },
      },
    };
  }
}

export default Activity;
