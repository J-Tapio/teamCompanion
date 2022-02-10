import errors from "./errors.schema.js";
import fitnessSchemas from "./activities.fitness.schema.js";

let {
  allFitnessActivities,
  fitnessByUserTeamActivityId,
  createExerciseSets,
  updateOrDeleteExerciseSets,
  updateCompletedExerciseSets,
} = fitnessSchemas;

let createObjectSchema = {
  type: "object",
  required: ["activityTypeId", "venueId", "activityStart", "activityEnd"],
  properties: {
    activityTypeId: { type: "integer" },
    opponentName: { type: ["string", "null"] },
    opponentLogo: { type: ["string", "null"] },
    activityNotes: { type: "string" },
    venueId: { type: "integer" },
    activityStart: { type: "string" },
    activityEnd: { type: "string" },
  }
}

let createdObjectSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    teamId: { type: "integer" },
    createdBy: { type: "integer" },
    activityTypeId: { type: "integer" },
    opponentName: { type: ["string", "null"] },
    opponentLogo: { type: ["string", "null"] },
    activityNotes: { type: ["string", "null"] },
    venueId: { type: "integer" },
    activityStart: { type: "string", format: "date-time" },
    activityEnd: { type: "string", format: "date-time" },
    createdAt: { type: "string", format: "date-time" },
  },
};

let updateObjectSchema = {
  type: "object",
  properties: {
    activityTypeId: { type: "integer" },
    opponentName: { type: ["string", "null"] },
    opponentLogo: { type: ["string", "null"] },
    activityNotes: { type: "string" },
    venueId: { type: "integer" },
    activityStart: { type: "string" },
    activityEnd: { type: "string" },
  },
};

let updatedObjectSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    teamId: { type: "integer" },
    createdBy: { type: "integer" },
    activityTypeId: { type: "integer" },
    opponentName: { type: ["string", "null"] },
    opponentLogo: { type: ["string", "null"] },
    activityNotes: { type: "string" },
    venueId: { type: "integer" },
    activityStart: { type: "string", format: "date-time" },
    activityEnd: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    updatedBy: { type: "integer" }
  },
};

let opponent = {
  type: "object",
  properties: {
    opponentName: { type: "string" },
    opponentLogo: { type: ["string", "null"] },
  },
};

let venue = {
  type: "object",
  properties: {
    venueId: { type: "integer" },
    venueName: { type: "string" },
    streetAddress: { type: "string" },
    zipCode: { type: "string" },
    city: { type: "string" },
    state: { type: "string" },
    country: { type: "string" },
  },
}

let teamMember = {
  type: "object",
  properties: {
    userTeamId: { type: "integer" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    teamRole: { enum: ["Coach", "Trainer", "Physiotherapist", "Athlete", "Staff"] }
  }
}

let participants = {
  type: "object",
  properties: {
    coaches: { type: "array", items: teamMember},
    trainers: { type: "array", items: teamMember},
    physiotherapists: { type: "array", items: teamMember},
    athletes: { type: "array", items: teamMember},
    staff: { type: "array", items: teamMember},
  }
}

let activity = {
  type: "object",
  properties: {
    id: { type: "integer" },
    activityTypeId: { type: "integer" },
    activityType: { type: "string" },
    activityStart: { type: "string", format: "date-time" },
    activityEnd: { type: "string", format: "date-time" },
    activityNotes: { type: ["string", "null"] },
    opponent,
    venue,
    participants,
    createdBy: teamMember,
    createdAt: { type: "string", format: "date-time" },
  },
};

let activities = {
  type: "object",
  properties: {
    teamMatch: { type: "array", items: activity},
    teamPractise: { type: "array", items: activity},
    teamMeeting: { type: "array", items: activity},
    fitness: { type: "array", items: activity},
    rehabilitation: { type: "array", items: activity},
  },
};


let allTeamActivities = {
  response: {
    200: {
      type: "object",
      properties: {
        data: activities,
    },
  },
  ...errors
  }
}

let teamActivityById = {
  response: {
    200: activity,
    ...errors
  }
}

let teamActivitiesByUserTeamId = {
  response: {
    200: {
      type: "object",
      properties: {
        data: activities
      }
    },
    ...errors
  }
}

let createTeamActivity = {
  body: createObjectSchema,
  response: {
    200: createdObjectSchema,
    ...errors
  }
}

let updateTeamActivity = {
  body: updateObjectSchema,
  response: {
    200: updatedObjectSchema,
    ...errors
  }
}

let deleteTeamActivity = {
  response: {
    ...errors
  }
}

let activityParticipants = {
  type: "array",
  items: {
    type: "object",
    required: ["userTeamId"],
      properties: {
      userTeamId: { type: "integer" },
      }
  }
};

let insertActivityParticipants = {
  body: {
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          type: "object",
          required: ["userTeamId"],
          properties: {
            userTeamId: { type: "integer" },
          },
        },
      },
    },
  },
  response: {
    ...errors,
  },
};

let deleteActivityParticipants = {
  body: {
    type: "object",
    properties: {
      data: activityParticipants,
    },
  },
  response: {
    ...errors
  },
};



export default {
  allTeamActivities,
  teamActivityById,
  teamActivitiesByUserTeamId,
  createTeamActivity,
  updateTeamActivity,
  deleteTeamActivity,
  insertActivityParticipants,
  deleteActivityParticipants,
  allFitnessActivities,
  fitnessByUserTeamActivityId,
  createExerciseSets,
  updateOrDeleteExerciseSets,
  updateCompletedExerciseSets
}
