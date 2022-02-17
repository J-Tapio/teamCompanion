import errors from "./errors.schema.js";

let allEquipmentResponse = {
  200: {
    type: "object",
    properties: {
      count: { type: "integer" },
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            equipmentName: { type: "string" },
            equipmentInfo: { type: ["string", "null"] },
            trainingModality: { enum: ["Strength", "Cardio"] },
            exercises: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  exerciseId: { type: "integer" },
                  exerciseName: { type: "string" },
                  exerciseInfo: { type: ["string", "null"] },
                  exerciseVariations: {
                    type: ["array", "null"],
                    items: { type: "string" },
                  },
                  exercisePositions: {
                    type: ["array", "null"],
                    items: { type: "string" },
                  },
                  exerciseInformation: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  ...errors,
};

let equipmentByIdResponse = {
  200: {
    type: "object",
    properties: {
      id: { type: "integer" },
      equipmentName: { type: "string" },
      equipmentInfo: { type: ["string", "null"] },
      trainingModality: { enum: ["Strength", "Cardio"] },
      exercises: {
        type: "array",
        items: {
          type: "object",
          properties: {
            exerciseId: { type: "integer" },
            exerciseName: { type: "string" },
            exerciseInfo: { type: ["string", "null"] },
            exerciseVariations: {
              type: ["array", "null"],
              items: { type: "string" },
            },
            exercisePositions: {
              type: ["array", "null"],
              items: { type: "string" },
            },
            exerciseInformation: { type: "string" },
          }
        },
      },
    },
  },
  ...errors,
}

let createEquipmentBody = {
  type: "object",
  required: ["equipmentName", "trainingModality"],
  properties: {
    equipmentName: { type: "string" },
    equipmentInfo: { type: ["string", "null"] },
    trainingModality: { enum: ["Strength", "Cardio"] },
  },
}

let createEquipmentResponse = {
  201: {
    type: "object",
    properties: {
      id: { type: "integer" },
      equipmentName: { type: "string" },
      equipmentInfo: { type: ["string", "null"] },
      trainingModality: { enum: ["Strength", "Cardio"] },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  ...errors,
}

let updateEquipmentBody = {
  type: "object",
  properties: {
    equipmentName: { type: "string" },
    equipmentInfo: { type: "string" },
    trainingModality: { enum: ["Strength", "Cardio"] },
  },
}

let updateEquipmentResponse = {
  200: {
    type: "object",
    properties: {
      equipmentName: { type: "string" },
      equipmentInfo: { type: "string" },
      trainingModality: { enum: ["Strength", "Cardio"] },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  ...errors,
}

/**
 * Equipment body and response schemas overall
 */

let allEquipment = {
  response: allEquipmentResponse,
};

let equipmentById = {
  response: equipmentByIdResponse
};

let createEquipment = {
  body: createEquipmentBody,
  response: createEquipmentResponse,
};
  
let updateEquipment = {
  body: updateEquipmentBody,
  response: updateEquipmentResponse,
};

let deleteEquipment = {
  response: {
    ...errors,
  },
};

export default {
  allEquipment,
  equipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
