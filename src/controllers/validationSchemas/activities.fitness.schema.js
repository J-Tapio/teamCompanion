import errors from "./errors.js";

let exerciseSets = {
  type: "array",
  items: {
    type: "object",
    required: [
      "exerciseSetId",
      "assignedExWeight",
      "assignedExRepetitions",
      "assignedExDuration",
      "assignedExDistance",
      "assignedExVariation",
      "assignedSetDone",
      "assignedSetDonePartially",
      "completedExWeight",
      "completedExRepetitions",
      "completedExDuration",
      "completedExDistance",
      "completedExSetNotes",
    ],
    properties: {
      exerciseSetId: { type: "integer" },
      assignedExWeight: { type: ["number", "null"], multipleOf: 0.01 },
      assignedExRepetitions: { type: ["integer", "null"] },
      assignedExDuration: { type: ["integer", "null"] },
      assignedExDistance: { type: ["number", "null"], multipleOf: 0.01 },
      assignedExVariation: { type: ["string", "null"] },
      assignedSetDone: { type: "boolean" },
      assignedSetDonePartially: { type: "boolean" },
      completedExWeight: { type: ["number", "null"], multipleOf: 0.01 },
      completedExRepetitions: { type: ["integer", "null"] },
      completedExDuration: { type: ["integer", "null"] },
      completedExDistance: { type: ["number", "null"], multipleOf: 0.01 },
      completedExSetNotes: { type:  ["string", "null"] },
    },
  },
};

let exercises = {
  type: "array",
  items: {
    type: "object",
    required: ["exercisesEquipmentId", "exerciseName", "equipmentName", "exerciseSets"],
    properties: {
      exercisesEquipmentId: { type: "integer" },
      exerciseName: { type: "string" },
      equipmentName: { type: "string" },
      exerciseSets
    }
  }
}

let fitnessActivities = {
  type: "array",
  items: {
    type: "object",
    required: ["userTeamActivitiesId", "rpeValue", "exercises"],
    properties: {
      userTeamActivitiesId: { type: "integer" },
      rpeValue: { type: ["integer", "null"], minimum: 1, maximum: 10 },
      exercises,
    },
  },
};

let teamMember = {
  type: "object",
  required: ["userTeamId", "firstName", "lastName", "teamRole"],
  properties: {
    userTeamId: { type: "integer" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    teamRole: { type: "string" },
  }
}

let allFitnessActivities = {
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            required: ["teamMember", "fitnessActivities"],
            properties: {
              teamMember,
              fitnessActivities
            }
          }
        }
      }
    },
    ...errors
  }
}

let fitnessByUserTeamActivityId = {
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              teamMember,
              fitnessActivity: {
                type: "object",
                properties: {
                  userTeamActivitiesId: { type: "integer" },
                  rpeValue: {
                    type: ["integer", "null"],
                    minimum: 1,
                    maximum: 10,
                  },
                  exercises,
                },
              },
            },
          },
        },
      },
    },
  },
};

// Create & Modify/Delete exercise sets

let createExerciseSets = {
  body: {
    type: "object",
    required: ["data"],
    properties: {
      data: {
        type: "array",
        items: {
          type: "object",
          required: [
            "userTeamActivitiesId",
            "exercisesEquipmentId",
            "assignedExWeight",
            "assignedExRepetitions",
            "assignedExDuration",
            "assignedExDistance",
          ],
          properties: {
            userTeamActivitiesId: { type: "integer" },
            exercisesEquipmentId: { type: "integer" },
            assignedExWeight: { type: ["number", "null"], multipleOf: 0.01 },
            assignedExRepetitions: { type: ["integer", "null"] },
            assignedExDuration: { type: ["integer", "null"] },
            assignedExDistance: { type: ["integer", "null"] },
            assignedExVariation: { type: ["string", "null"] },
          },
        },
      }
    }
  },
  response: {
    201: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              userTeamActivitiesId: { type: "integer" },
              exercisesEquipmentId: { type: "integer" },
              assignedExWeight: { type: ["number", "null"], multipleOf: 0.01 },
              assignedExRepetitions: { type: ["integer", "null"] },
              assignedExDuration: { type: ["integer", "null"] },
              assignedExDistance: {
                type: ["integer", "null"],
              },
              assignedExVariation: { type: ["string", "null"] },
            },
          },
        },
      },
    },
    ...errors,
  },
};

export default {
  allFitnessActivities,
  fitnessByUserTeamActivityId,
  createExerciseSets
}