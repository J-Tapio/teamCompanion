import { Model } from "objection";

class UserTeamActivities extends Model {
  static get tableName() {
    return "user_team_activities";
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
      required: ["userTeamId", "teamActivityId"],
      properties: {
        id: { type: "integer" },
        userTeamId: { type: "integer" },
        teamActivityId: { type: "integer" },
        rpeValue: { type: ["integer", "null"], minimum: 1, maximum: 10 }
      }
    }
  }
}

export default UserTeamActivities;