import { Model } from "objection";

class UserTeams extends Model {
  static get tableName() {
    return "user_teams";
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
      required: ["userId", "teamId", "teamRole", "status"],
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        teamId: { type: "integer" },
        teamRole: {
          enum: ["Coach", "Physiotherapist", "Trainer", "Athlete", "Staff"],
        },
        status: { enum: ["Active", "Injured", "Inactive", "Vacation", "Sick"] },
      },
    };
  }
}

export default UserTeams;