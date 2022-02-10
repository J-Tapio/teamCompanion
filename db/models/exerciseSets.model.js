import objection, { Model } from "objection";
import UserTeamActivities from "./userTeamActivities.model.js";
import ExercisesEquipment from "./exercisesEquipment.model.js";

class ExerciseSets extends Model {
  static get tableName() {
    return "exercise_sets";
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();

    /**
     * If ExWeight not null, ExRepetitions cannot be null
     * ! Not operator used to check also 0, undefined, false,empty string etc.
     * Might be overkill, Fastify and Objection already validate payload
     */
    if (
      (!this.assignedExWeight && this.assignedExRepetitions) ||
      (this.assignedExWeight && !this.assignedExRepetitions) ||
      (
        this.assignedSetDonePartially && 
        !this.completedExWeight && 
        this.completedExRepetitions
      ) ||
      (
        this.assignedSetDonePartially && 
        this.completedExWeight &&
        !this.completedExRepetitions
      )
    ) {
      throw new objection.ValidationError({
        message:
          "When assigning exercise with weight, repetitions has to be assigned.",
        type: "Either ExWeight or ExRepetitions cannot be null when one has value other than null.",
      });
    }
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "userTeamActivitiesId", 
        "exercisesEquipmentId", 
        "assignedExWeight", 
        "assignedExRepetitions", 
        "assignedExDuration", 
        "assignedExDistance"
      ],
      properties: {
        id: { type: "integer" },
        userTeamActivitiesId: { type: "integer" },
        exercisesEquipmentId: { type: "integer" },
        assignedExWeight: { type: ["number", "null"], multipleOf: 0.01 },
        assignedExRepetitions: { type: ["integer", "null"] },
        assignedExDuration: { type: ["integer", "null"] },
        assignedExDistance: { type: ["integer", "null"] },
        assignedExVariation: { type: ["string", "null"] },
        assignedSetDone: { type: "boolean" },
        assignedSetDonePartially: { type: "boolean" },
        completedExWeight: { type: ["number", "null"], multipleOf: 0.01 },
        completedExRepetitions: { type: ["integer", "null"] },
        completedExDuration: { type: ["integer", "null"] },
        completedExDistance: { type: ["integer", "null"] },
        completedExSetNotes: { type: ["string", "null"] },
      },
    };
  }

  static get relationMappings() {
    return {
      userTeamActivities: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserTeamActivities,
        join: {
          from: "exercise_sets.userTeamActivitiesId",
          to: "user_team_activities.id"
        }
      },
      exercisesEquipment: {
        relation: Model.BelongsToOneRelation,
        modelClass: ExercisesEquipment,
        join: {
          from: "exercise_sets.exercisesEquipmentId",
          to: "exercises_equipment.id",
        },
      }
    }
  };
}

export default ExerciseSets;