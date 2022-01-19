import errors from "./errors.js";

const allActivities = {
  response: {
    200: {
      type: "object",
      required: ["count", "data"],
      properties: {
        count: { type: "integer" },
        data: { type: "array" },
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            teamId: { type: "integer" },
            activityStart: { type: "string", format: "date-time" },
            activityEnd: { type: "string", format: "date-time" },
            rpeValue: { type: ["integer", null] },
            createdBy: { type: "integer" },
          },
        },
      },
    },
    ...errors
  },
};

const newActivity = {
  request: {
    body: {
      type: "object",
      required: [
        "userId",
        "teamId",
        "activityStart",
        "activityEnd",
        "rpeValue",
      ],
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        teamId: { type: "integer" },
        activityStart: { type: "string", format: "date-time" },
        activityEnd: { type: "string", format: "date-time" },
        rpeValue: { type: ["integer", null] },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        teamId: { type: "integer" },
        activityStart: { type: "string", format: "date-time" },
        activityEnd: { type: "string", format: "date-time" },
        rpeValue: { type: ["integer", null] },
        createdBy: { type: "integer" },
        createdAt: { type: "string", format: "date-time" },
      },
    },
    ...errors
  },
};

const updateActivity = {
  request: {
    body: {
      type: "object",
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        teamId: { type: "integer" },
        activityStart: { type: "string", format: "date-time" },
        activityEnd: { type: "string", format: "date-time" },
        rpeValue: { type: ["integer", null] },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        teamId: { type: "integer" },
        activityStart: { type: "string", format: "date-time" },
        activityEnd: { type: "string", format: "date-time" },
        rpeValue: { type: ["integer", null] },
        createdBy: { type: "integer" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
    ...errors
  },
};

const deleteActivity = {
  response: {
    ...errors,
  },
};