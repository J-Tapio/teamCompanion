import errors from "./errors.schema.js";
import countries from "../../../db/utils/countries.js"

let allTeamVenuesResponse = {
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
            venueName: { type: "string" },
            streetAddress: { type: "string", minLength: 1, maxLength: 255 },
            city: { type: "string", minLength: 1, maxLength: 100 },
            state: { type: "string", minLength: 1, maxLength: 100 },
            zipCode: { type: "string", minLength: 1, maxLength: 100 },
            country: { enum: countries },
            teamId: { type: "integer" },
          },
        },
      }
    }
  },
  ...errors
}

let createTeamVenueBody = {
  type: "object",
  required: [
    "venueName",
    "streetAddress",
    "zipCode",
    "city",
    "state",
    "country",
  ],
  properties: {
    venueName: { type: "string" },
    streetAddress: {
      type: "string",
      minLength: 1,
      maxLength: 255,
    },
    city: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      pattern: "^(([a-zA-Z]+)(s{0,1})){1,3}\\s{0}$",
    },
    state: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      pattern: "^(([a-zA-Z]+)(s{0,1})){1,3}\\s{0}$",
    },
    zipCode: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      pattern: "^[0-9]+$",
    },
    country: { enum: countries },
  },
};

let createTeamVenueResponse = {
  201: {
    type: "object",
    properties: {
      id: { type: "integer" },
      venueName: { type: "string" },
      streetAddress: { type: "string", minLength: 1, maxLength: 255 },
      city: { type: "string",  minLength: 1, maxLength: 100 },
      state: { type: "string", minLength: 1, maxLength: 100 },
      zipCode: { type: "string", minLength: 1, maxLength: 100 },
      country: { enum: countries },
      teamId: { type: "integer" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  ...errors,
};
  
let updateTeamVenueBody = {
  type: "object",
  properties: {
    venueName: { type: "string" },
    streetAddress: { type: "string", minLength: 1, maxLength: 255 },
    city: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      pattern: "^(([a-zA-Z]+)(s{0,1})){1,3}\\s{0}$",
    },
    state: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      pattern: "^(([a-zA-Z]+)(s{0,1})){1,3}\\s{0}$",
    },
    zipCode: { 
      type: "string", 
      minLength: 1, 
      maxLength: 100, 
      pattern: "^[0-9]+$" 
    },
    country: { enum: countries },
  },
};
  
let updateTeamVenueResponse = {
  200: {
    type: "object",
    properties: {
      id: { type: "integer" },
      venueName: { type: "string" },
      streetAddress: { type: "string", minLength: 1, maxLength: 255 },
      city: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },
      state: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },
      zipCode: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },
      country: { enum: countries },
      teamId: { type: "integer" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  ...errors,
};

/** 
 * Team venue body and response schemas overall
 */

let allTeamVenues = {
  response: allTeamVenuesResponse,
}
  
let createTeamVenue = {
  body: createTeamVenueBody,
  response: createTeamVenueResponse,
};

let updateTeamVenue = {
  body: updateTeamVenueBody,
  response: updateTeamVenueResponse,
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