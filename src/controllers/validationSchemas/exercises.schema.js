import errors from "./errors.schema.js";

let allExercisesResponse = {
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
}

let exerciseByIdResponse = {
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
}

let createExerciseBody = {
  type: "object",
  required: ["exerciseName"],
  properties: {
    exerciseName: { type: "string" },
    exerciseInfo: { type: ["string", "null"] },
  },
}

let createExerciseResponse = {
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
}

let updateExerciseBody = {
  type: "object",
  properties: {
    exerciseName: { type: "string" },
    exerciseInfo: { type: "string" },
  },
}

let updateExerciseResponse = {
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
}

let exercisesEquipmentResponse = {
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
}

let exToEqResponse = {
  200: {
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            exerciseId: { type: "integer" },
            exerciseName: { type: "string" },
            equipmentId: { type: "integer" },
            equipmentName: { type: "string" },
          },
        },
      },
    },
  },
};

let exToEqIdResponse = {
  200: {
    type: "object",
    properties: {
      exercisesEquipmentId: { type: "integer" },
    }
  }
}

// Validation for new exercise with equipment
let createExercisesEquipmentBody = {
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
}

let createExercisesEquipmentResponse = {
  201: {
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
    exerciseInformation: { type: ["string", "null"] },
    createdAt: { type: "string", format: "date-time" },
  },
  },
  ...errors
}

/**
 * Exercises & ExercisesEquipment body and response schemas overall
 */

let allExercises = {
  response: allExercisesResponse,
};

//! Newly added. Needed when assigning exercises to fitness event.
let exToEqId = {
  response: exToEqIdResponse,
};

let exerciseById = {
  response: exerciseByIdResponse,
};

let createExercise = {
  body: createExerciseBody,
  response: createExerciseResponse,
};

let updateExercise = {
  body: updateExerciseBody,
  response: updateExerciseResponse,
};

const deleteExercise = {
  response: { // 204 response does not contain a body.
    ...errors,
  },
};

/**
 * ExercisesEquipment
 * Creation of new exercise with equipment happens through /exercises route
 * Validation added here.
 */

let exercisesEquipment = {
  response: exercisesEquipmentResponse,
};

let createExerciseEquipment = {
  body: createExercisesEquipmentBody,
  response: createExercisesEquipmentResponse,
};

export default {
  allExercises,
  exToEqId,
  exerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  exercisesEquipment,
  createExerciseEquipment,
};
