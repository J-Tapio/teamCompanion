import countries from "../../../db/utils/countries.js"
import errors from "./errors.schema.js";


const allTeams = {
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
              teamName: { type: "string" },
              streetAddress: { type: "string" },
              city: { type: "string" },
              zipCode: { type: "string" },
              state: { type: "string" },
              country: { type: "string" },
            },
          },
        },
      },
    },
    ...errors,
  },
};

const usersTeams = {
  response: {
    200: {
      type: "object",
      properties: {
        teams: { type: "array" },
        items: {
          type: "object",
          properties: {
            teamId: { type: "string" }, 
            teamName: { type: "string" },
            teamRole: { type: "string" },
          }
        }
      }
    },
    ...errors,
  }
}

const teamMember = {
  type: "object",
  properties: {
    userId: { type: "integer" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    teamRole: { type: "string" },
    status: { type: "string" },
  }
}

const teamById = {
  response: {
    200: {
      type: "object",
      properties: {
        teamId: { type: "integer" },
        teamName: { type: "string" },
        teamAddress: {
          type: "object",
          properties: {
            streetAddress: { type: "string" },
            city: { type: "string" },
            zipCode: { type: "string" },
            state: { type: "string" },
            country: { type: "string" },
          },
        },
        teamMembers: {
          type: "object",
          properties: {
            coaches: { type: ["array", "null"], items: teamMember },
            trainers: { type: ["array", "null"], items: teamMember },
            athletes: { type: ["array", "null"], items: teamMember },
            physiotherapists: { type: ["array", "null"], items: teamMember },
            staff: { type: ["array", "null"], items: teamMember },
          },
        },
      },
    },
    ...errors,
  },
};

const createTeam = {
  request: {
    body: {
      type: "object",
      required: [
        "teamName",
        "streetAddress",
        "city",
        "state",
        "zipCode",
        "country",
        "teamRole"
      ],
      properties: {
        id: { type: "integer" },
        teamName: { type: "string" },
        streetAddress: { type: "string" },
        city: { type: "string" },
        zipCode: { type: "string" },
        state: { type: "string" },
        country: { enum: countries },
        teamRole: {enum: ["Coach", "Staff"]}
      },
    },
  },
  response: {
    200: {
      type: "object",
      required: [
        "id",
        "teamName",
        "streetAddress",
        "city",
        "state",
        "zipCode",
        "country",
        "createdAt",
      ],
      properties: {
        id: { type: "integer" },
        teamName: { type: "string" },
        streetAddress: { type: "string" },
        city: { type: "string" },
        zipCode: { type: "string" },
        state: { type: "string" },
        country: { type: "string" },
        createdAt: { type: "string", format: "date-time" }
      },
    },
    ...errors,
  }
};

const updateTeam = {
  request: {
    type: "object",
    properties: {
      teamName: { type: "string" },
      streetAddress: { type: "string" },
      city: { type: "string" },
      zipCode: { type: "string" },
      state: { type: "string" },
      country: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        teamName: { type: "string" },
        streetAddress: { type: "string" },
        city: { type: "string" },
        zipCode: { type: "string" },
        state: { type: "string" },
        country: { type: "string" },
        updatedAt: { type: "string", format: "date-time" }
      },
    },
    ...errors,
  },
};

const deleteTeam = {
  response: {
    ...errors,
  },
};

export default {
  allTeams,
  teamById,
  createTeam,
  updateTeam,
  deleteTeam,
  usersTeams
}