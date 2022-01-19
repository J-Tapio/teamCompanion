import { Model } from "objection";
import Equipment from "./equipment.model.js";

//const modelFolderPath = dirname(fileURLToPath(import.meta.url));

class Exercises extends Model {
  static get tableName() {
    return "exercises";
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
      required: ["exerciseName", "createdBy"],
      properties: {
        id: { type: "integer" },
        exerciseName: { type: "string", minLength: 1, maxLength: 100 },
        exerciseInfo: { type: ["string", "null"], minLength: 1, maxLength: 510 },
        createdBy: { type: "integer" },
      },
    };
  }

  static get relationMappings() {
    return {
      equipment: {
        relation: Model.HasOneThroughRelation,
        modelClass: Equipment,
        join: {
          from: "exercises.id",
          through: {
            from: "exercises_equipment.exercise_id",
            to: "exercises_equipment.equipment_id",
          },
          to: "equipment.id",
        }
      }
    }
  };
}

export default Exercises;