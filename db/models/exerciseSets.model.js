import { Model } from "objection";

class ExerciseSets extends Model {
  static get tableName() {
    return "exercise_sets";
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "activityId",
        "exEqId",
        "exWeight",
        "exRepetitions",
        "exDuration",
        "exDistance",
      ],
      properties: {
        id: { type: "integer" },
        activityId: { type: "integer" },
        exEqId: { type: "integer" },
        exWeight: { type: ["number", "null"] },
        exRepetitions: { type: ["integer", "null"] },
        exDuration: { type: ["integer", "null"] },
        exDistance: { type: ["integer", "null"] },
        exVariations: { type: "array", items: {type: "string"}},
      },
    };
  }

  static relationMappings = {
    exEqId: {
      relation: Model.BelongsToOneRelation,
      modelClass: ExerciseEquipment,
      join: {
        from: "exercise_sets.ex_eq_id",
        to: "exercise_equipment.id",
      },
    },
  };
}

export default ExerciseSets;