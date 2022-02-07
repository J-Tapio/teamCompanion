import errors from "./errors.schema.js";

const allExercises = {
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
              exerciseName: { type: "string" },
              exerciseInfo: { type: ["string", "null"] },
              equipment: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    equipmentId: { type: "integer" },
                    equipmentName: { type: "string" },
                    equipmentInfo: { type: ["string", "null"] },
                    trainingModality: { type: "string" },
                    exerciseVariations: {
                      type: ["array", "null"],
                      items: { type: "string" },
                    },
                    exercisePositions: {
                      type: ["array", "null"],
                      items: { type: "string" },
                    },
                    exerciseInformation: { type: ["string", "null"] },
                  },
                },
              },
            },
          },
        },
      },
    },
    ...errors
  },
};

const exerciseById = {
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        exerciseName: { type: "string" },
        exerciseInfo: { type: ["string", "null"] },
        equipment: {
          type: "array",
          items: {
            type: "object",
            properties: {
              equipmentId: { type: "integer" },
              equipmentName: { type: ["string", "null"] },
              equipmentInfo: { type: ["string", "null"] },
              trainingModality: { type: "string" },
              exerciseVariations: {
                type: ["array", "null"],
                items: { type: "string" },
              },
              exercisePositions: {
                type: ["array", "null"],
                items: { type: "string" },
              },
              exerciseInformation: { type: ["string", "null"] },
            },
          },
        },
      },
    },
    ...errors
  },
};

const createExercise = {
  request: {
    body: {
      type: "object",
      required: ["exerciseName"],
      properties: {
        exerciseName: { type: "string" },
        exerciseInfo: { type: ["string", "null"] },
      },
    },
  },
  response: {
    201: {
      type: "object",
      required: ["id", "exerciseName", "exerciseInfo", "createdAt"],
      properties: {
        id: { type: "integer" },
        exerciseName: { type: "string" },
        exerciseInfo: { type: ["string", "null"] },
        createdAt: { type: "string", format: "date-time" },
      },
    },
    ...errors
  },
};

const updateExercise = {
  request: {
    body: {
      type: "object",
      properties: {
        exerciseName: { type: "string" },
        exerciseInfo: { type: "string" },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "string" },
        exerciseName: { type: "string" },
        exerciseInfo: { type: ["string", "null"] },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
    ...errors
  },
};

const deleteExercise = {
  response: {
    ...errors,
  },
};

// VALIDATION FOR EXERCISES /new
const exercisesEquipment = {
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            exercises: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  exerciseName: { type: "string" },
                },
              },
            },
            equipment: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  equipmentName: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    ...errors
  },
};

/*   dependentRequired: {
    exerciseId: ["equipmentName", "trainingModality"],
    equipmentId: ["exerciseName"]
  }, */

const createExerciseEquipment = {
  request: {
    body: {
      type: "object",
      properties: {
        exerciseId: { type: ["integer", "null"] },
        equipmentId: { type: ["integer", "null"] },
        exerciseName: { type: ["string", "null"] },
        exerciseInfo: { type: ["string", "null"] },
        equipmentName: { type: ["string", "null"] },
        equipmentInfo: { type: ["string", "null"] },
        trainingModality: { enum: ["Strength", "Cardio"] },
        exerciseVariations: {
          type: ["array", "null"],
          items: { type: "string" },
        },
        exercisePositions: {
          type: ["array", "null"],
          items: { type: "string" },
        },
        exerciseInformation: { type: ["string", "null"] },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        exerciseId: { type: "integer" },
        exerciseName: { type: "string" },
        exerciseInfo: { type: ["string", "null"] },
        equipmentId: { type: "integer" },
        equipmentName: { type: "string" },
        equipmentInfo: { type: ["string", "null"] },
        trainingModality: { enum: ["Strength", "Cardio"] }, //?
        exerciseVariations: {
          type: ["array", "null"],
          items: { type: "string" },
        },
        exercisePositions: {
          type: ["array", "null"],
          items: { type: "string" },
        },
        exerciseInformation: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
      },
    },
    ...errors
  },
};

export default {
  allExercises,
  exerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  exercisesEquipment,
  createExerciseEquipment,
};
