import { Model } from "objection";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Exercises from "./exercises.model.js";

//const modelFolderPath = dirname(fileURLToPath(import.meta.url));

class Equipment extends Model {
  static get tableName() {
    return "equipment";
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
      required: ["equipmentName", "trainingModality", "createdBy"],
      properties: {
        id: { type: "integer" },
        equipmentName: { type: "string", minLength: 1, maxLength: 100 },
        equipmentInfo: { type: ["string", "null"], minLength: 1, maxLength: 255 },
        trainingModality: { enum: ["Strength", "Cardio"] },
        createdBy: { type: "integer" }
      },
    };
  }

  static get relationMappings() {
    return {
      exercises: {
        relation: Model.HasOneThroughRelation,
        modelClass: Exercises,
        join: {
          from: "equipment.id",
          through: {
            from: "exercises_equipment.equipment_id",
            to: "exercises_equipment.exercise_id",
          },
          to: "exercises.id",
        }
      }
    }
  };
}

export default Equipment;