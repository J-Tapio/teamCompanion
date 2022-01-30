import errors from "./errors.js";
import countries from "../../../db/utils/countries.js"

let venueObject = {
  type: "object",
  properties: {
    id: { type: "integer" },
    venueName: { type: "string" },
    streetAddress: { type: "string", minLength: 1, maxLength: 255 },
    city: { type: "string", minLength: 1, maxLength: 100 },
    state: { type: "string", minLength: 1, maxLength: 100 },
    zipCode: { type: "string", minLength: 1, maxLength: 100 },
    country: { enum: countries },
    teamId: { type: "integer" },
  },
};

let venues = {
  type: "array",
  items: venueObject,
};


let allTeamVenues = {
  response: {
    200: {
      type: "object",
      properties: {
        data: venues
      }
    },
    ...errors
  }
}

let createTeamVenue = {
  request: {
    body: {
      ...venueObject,
      required: [
        "venueName",
        "streetAddress",
        "zipCode",
        "city",
        "state",
        "country",
      ],
    },
  },
  response: {
    200: {
      ...venueObject, 
      createdAt: { type: "string", format: "date-time" }
    }
  },
};

let updateTeamVenue = {
  request: {
    body: {
      type: "object",
      properties: {
        venueName: { type: "string" },
        streetAddress: { type: "string", minLength: 1, maxLength: 255 },
        city: { type: "string", minLength: 1, maxLength: 100 },
        state: { type: "string", minLength: 1, maxLength: 100 },
        zipCode: { type: "string", minLength: 1, maxLength: 100 },
        country: { enum: countries },
      },
    },
  },
  response: {
    200: {...venueObject, updatedAt: { type: "string", format: "date-time" }},
    ...errors
  }
};

let deleteTeamVenue = {
  response: {
    ...errors
  }
}

export default {
  allTeamVenues,
  updateTeamVenue,
  createTeamVenue,
  deleteTeamVenue,
}