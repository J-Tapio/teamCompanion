import { Model } from "objection";

class ExercisesEquipment extends Model {
  static get tableName() {
    return "exercises_equipment";
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get jsonAttributes() {
    return [];
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["equipmentId", "exerciseId"],
      properties: {
        id: { type: "integer" },
        equipmentId: { type: "integer" },
        exerciseId: { type: "integer" },
        exerciseVariations: {
          type: ["array", "null"],
          items: { type: "string" },
        },
        exercisePositions: {
          type: ["array", "null"],
          items: { type: "string" },
        },
        exerciseInformation: {
          type: ["string", "null"],
          minLength: 1,
          maxLength: 510,
        },
      },
    };
  }
}

export default ExercisesEquipment;