import errors from "./errors.schema.js";

const allEquipment = {
  response: {
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
                  }
                },
              },
            },
          },
        },
      },
    },
    ...errors,
  },
};

const equipmentById = {
  response: {
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
  },
};

const createEquipment = {
  request: {
    body: {
      type: "object",
      required: ["equipmentName", "trainingModality"],
      properties: {
        equipmentName: { type: "string" },
        equipmentInfo: { type: ["string", "null"] },
        trainingModality: { enum: ["Strength", "Cardio"] },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        equipmentName: { type: "string" },
        equipmentInfo: { type: ["string", "null"] },
        trainingModality: { enum: ["Strength", "Cardio"] },
        createdAt: { type: "string", format: "date-time" },
      },
    },
    ...errors,
  },
};

const updateEquipment = {
  request: {
    body: {
      type: "object",
      properties: {
        equipmentName: { type: "string" },
        equipmentInfo: { type: "string" },
        trainingModality: { enum: ["Strength", "Cardio"] },
      },
    },
  },
  response: {
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
  },
};

const deleteEquipment = {
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
