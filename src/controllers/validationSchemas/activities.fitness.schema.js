import errors from "./errors.schema.js";

let exerciseSets = {
  type: "array",
  elements: {
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
      assignedExWeight: { type: ["number", "null"], multipleOf: 0.250 },
      assignedExRepetitions: { type: ["integer", "null"] },
      assignedExDuration: { type: ["integer", "null"] },
      assignedExDistance: { type: ["integer", "null"] },
      assignedExVariation: { type: ["string", "null"] },
      assignedSetDone: { type: "boolean" },
      assignedSetDonePartially: { type: "boolean" },
      completedExWeight: { type: ["number", "null"], multipleOf: 0.250 },
      completedExRepetitions: { type: ["integer", "null"] },
      completedExDuration: { type: ["integer", "null"] },
      completedExDistance: { type: ["integer", "null"] },
      completedExSetNotes: { type: ["string", "null"] },
    },
  },
};

let exercises = {
  type: "array",
  elements: {
    type: "object",
    required: [
      "exercisesEquipmentId",
      "exerciseName",
      "equipmentName",
      "exerciseSets",
    ],
    properties: {
      exercisesEquipmentId: { type: "integer" },
      exerciseName: { type: "string" },
      equipmentName: { type: "string" },
      exerciseSets: exerciseSets,
    },
  },
};

let fitnessActivities = {
  type: "array",
  elements: {
    type: "object",
    required: ["userTeamActivitiesId", "rpeValue", "exercises"],
    properties: {
      userTeamActivitiesId: { type: "integer" },
      rpeValue: { type: ["integer", "null"], minimum: 1, maximum: 10 },
      exercises: exercises,
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
  },
};

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
              teamMember: teamMember,
              fitnessActivities: fitnessActivities,
            },
          },
        },
      },
    },
    ...errors,
  },
};

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
              teamMember: teamMember,
              fitnessActivity: {
                type: "object",
                properties: {
                  userTeamActivitiesId: { type: "integer" },
                  rpeValue: {
                    type: ["integer", "null"],
                    minimum: 1,
                    maximum: 10,
                  },
                  exercises: exercises,
                },
              },
            },
          },
        },
      },
    },
  },
};

// Create / Modify / Delete exercise sets

let createExerciseSets = {
  body: {
    type: "object",
    required: ["data"],
    properties: {
      data: {
        type: "array",
        items: {
          //type: ["object", "integer"],
          anyOf: [
            {
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
                assignedExWeight: {
                  type: ["number", "null"],
                  multipleOf: 0.250,
                },
                assignedExRepetitions: { type: ["integer", "null"] },
                assignedExDuration: { type: ["integer", "null"] },
                assignedExDistance: { type: ["integer", "null"] },
                assignedExVariation: { type: ["string", "null"] },
              },
            },
            { type: "integer" },
          ],
        },
      },
    },
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
              assignedExWeight: { type: ["number", "null"], multipleOf: 0.250 },
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

let updateOrDeleteExerciseSets = {
  body: {
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          //type: ["object", "integer"],
          anyOf: [
            {
              type: "object",
              required: ["id", "userTeamActivitiesId"],
              properties: {
                id: { type: "integer" },
                userTeamActivitiesId: { type: "integer" },
                exercisesEquipmentId: { type: "integer" },
                assignedExWeight: { type: ["number", "null"], multipleOf: 0.250 },
                assignedExRepetitions: { type: ["integer", "null"] },
                assignedExDuration: { type: ["integer", "null"] },
                assignedExDistance: {
                  type: ["integer", "null"],
                },
                assignedExVariation: { type: ["string", "null"] },
              },
            },
            { type: "integer" },
          ],
        },
      },
    },
  },
  response: {
    200: {
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
              assignedExWeight: { type: ["number", "null"], multipleOf: 0.250 },
              assignedExRepetitions: { type: ["integer", "null"] },
              assignedExDuration: { type: ["integer", "null"] },
              assignedExDistance: {
                type: ["integer", "null"],
              },
              assignedExVariation: { type: ["string", "null"] },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    ...errors,
  },
};

let updateCompletedExerciseSets = {
  body: {
    type: "object",
    required: ["data"],
    properties: {
      data: {
        type: "array",
        items: {
          type: "object",
          required: ["userTeamActivitiesId"],
          properties: {
            id: { type: "integer" },
            userTeamActivitiesId: { type: "integer" },
            assignedSetDone: { type: "boolean" },
            assignedSetDonePartially: { type: "boolean" },
            completedExWeight: { type: ["number", "null"], multipleOf: 0.250 },
            completedExRepetitions: { type: ["integer", "null"] },
            completedExDuration: { type: ["integer", "null"] },
            completedExDistance: { type: ["integer", "null"] },
            completedExSetNotes: { type: ["string", "null"] },
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              userTeamActivitiesId: { type: "integer" },
              assignedSetDone: { type: "boolean" },
              assignedSetDonePartially: { type: "boolean" },
              completedExWeight: { type: ["number", "null"], multipleOf: 0.250 },
              completedExRepetitions: { type: ["integer", "null"] },
              completedExDuration: { type: ["integer", "null"] },
              completedExDistance: { type: ["integer", "null"] },
              completedExSetNotes: { type: ["string", "null"] },
              updatedAt: { type: "string", format: "date-time" },
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
  createExerciseSets,
  updateOrDeleteExerciseSets,
  updateCompletedExerciseSets,
};
