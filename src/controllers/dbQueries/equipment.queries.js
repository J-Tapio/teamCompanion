import Equipment from "../../../db/models/equipment.model.js";
import EquipmentQueryFormatter from "../dbResultFormatters/equipment.resultformatter.js";

export default class EquipmentQueries {
  static async allEquipment() {
    let dbResult = await Equipment.query()
      .joinRelated({ exercises: true })
      .select(
        "equipment.id",
        "equipment.equipmentName",
        "equipment.trainingModality",
        "equipment.equipmentInfo",
        "exercises.id as exerciseId",
        "exercises.exerciseName",
        "exercises.exerciseInfo",
        "exercises_join.exerciseVariations",
        "exercises_join.exercisePositions",
        "exercises_join.exerciseInformation"
      )
      .orderBy("equipment.id", "asc")
      .orderBy("equipmentId", "asc")
      .throwIfNotFound();
    
    return EquipmentQueryFormatter.allEquipment(dbResult);
  }

  static async equipmentById({equipmentId}) {
    let dbResult = await Equipment.query()
      .joinRelated({ exercises: true })
      .select(
        "equipment.id",
        "equipment.equipmentName",
        "equipment.trainingModality",
        "equipment.equipmentInfo",
        "exercises.id as exerciseId",
        "exercises.exerciseName",
        "exercises.exerciseInfo",
        "exercises_join.exerciseVariations",
        "exercises_join.exercisePositions",
        "exercises_join.exerciseInformation"
      )
      .orderBy("equipmentId", "asc")
      .where("equipment.id", equipmentId)
      .throwIfNotFound();
    
    return EquipmentQueryFormatter.equipmentById(dbResult);
  }

  static async createEquipment({userId, equipmentInformation}) {
    let { updatedAt, ...createdEquipment } = await Equipment.query()
      .insert({ ...equipmentInformation, createdBy: userId })
      .returning("*");
    
    return createdEquipment;
  }

  static async updateEquipment({equipmentId, updateInformation}) {
    return await Equipment.query()
      .patch(updateInformation)
      .where("equipment.id", equipmentId)
      .returning(
        "id",
        "equipmentName",
        "trainingModality",
        "equipmentInfo",
        "updatedAt"
      )
      .first()
      .throwIfNotFound();
  }

  static async deleteEquipment({equipmentId}) {
    await Equipment.query()
    .deleteById(equipmentId)
    .throwIfNotFound();
  }
}