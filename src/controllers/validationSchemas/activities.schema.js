import errors from "./errors.js";

const allTeamActivities = {
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
              activityId: { type: "integer" },
              activityType: { type: "string" },
              activityStart: {type: "string", format: "date-time"},
              activityEnd: {type: "string", format: "date-time"},
              rpeValue: { type: "integer" },
              athlete: {
                userId: { type: "integer" },
                userTeamId: { type: "integer" },
                firstName: { type: "string" },
                lastName: { type: "string" },
                teamRole: { type: "string" },
              },
              createdBy: {
                userId: { type: "integer" },
                userTeamId: { type: "integer" },
                firstName: { type: "string" },
                lastName: { type: "string" },
                teamRole: { type: "string" },
              }
            }
          }
        }
      }
    },
    ...errors
  },
};

const teamActivityById = {
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        activityId: { type: "integer" },
        activityType: { type: "string" },
        activityStart: { type: "string", format: "date-time" },
        activityEnd: { type: "string", format: "date-time" },
        rpeValue: { type: "integer" },
        athlete: {
          userId: { type: "integer" },
          userTeamId: { type: "integer" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          teamRole: { type: "string" },
        },
        createdBy: {
          userId: { type: "integer" },
          userTeamId: { type: "integer" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          teamRole: { type: "string" },
        },
      },
    },
  },
};

const newTeamActivity = {
  request:{
    type: "object",
    required: ["athlete_id", "activity_id", "activity_start", "activity_end", "created_by"],
    properties: {
      id: { type: "integer" },
      athleteId: { type: "integer" },
      activityId: { type: "integer" },
      activityStart: { type: "string", format: "date-time" },
      activityEnd: { type: "string", format: "date-time" },
      rpeValue: {type: "integer", minValue: 1, maxValue: 10 },
      createdBy: { type: "integer" },
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        athleteId: { type: "integer" },
        activityId: { type: "integer" },
        activityStart: { type: "string", format: "date-time" },
        activityEnd: { type: "string", format: "date-time" },
        rpeValue: {type: "integer", minValue: 1, maxValue: 10 },
        createdBy: { type: "integer" },
        updatedAt: { type: "string", format: "date-time" }
      }
    },
    ...errors
  }
}

const updateTeamActivity = {
  request: {
    type: "object",
    properties: {
      athleteId: { type: "integer" },
      activityId: { type: "integer" },
      activityStart: { type: "string", format: "date-time" },
      activityEnd: { type: "string", format: "date-time" },
      rpeValue: { type: "integer", minValue: 1, maxValue: 10 },
      createdBy: { type: "integer" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        athleteId: { type: "integer" },
        activityId: { type: "integer" },
        activityStart: { type: "string", format: "date-time" },
        activityEnd: { type: "string", format: "date-time" },
        rpeValue: { type: "integer", minValue: 1, maxValue: 10 },
        createdBy: { type: "integer" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
    ...errors,
  },
};

const deleteTeamActivity = {
  response: {
    ...errors
  }
}


export default {
  allTeamActivities,
  teamActivityById,
  newTeamActivity,
  updateTeamActivity,
  deleteTeamActivity
}