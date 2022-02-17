import errors from "./errors.schema.js";

const allUsers = {
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
              email: { type: "string", format: "email" },
              firstName: { type: "string" },
              lastName: { type: "string" },
              dateOfBirth: { type: "string", format: "date" },
              streetAddress: { type: "string" },
              city: { type: "string" },
              state: { type: "string" },
              zipCode: { type: "string" },
              country: { type: "string" },
            },
          },
        },
      },
    },
    ...errors
  },
};

const userById = {
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        email: { type: "string", format: "email" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        dateOfBirth: { type: "string", format: "date" },
        streetAddress: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        zipCode: { type: "integer" },
        country: { type: "string" },
      },
    },
    ...errors
  },
};

const createUser = {
  body: {
    type: "object",
    required: [
      "firstName",
      "lastName",
      "dateOfBirth",
      "streetAddress",
      "city",
      "state",
      "zipCode",
      "country",
    ],
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      dateOfBirth: { type: "string", format: "date" },
      streetAddress: { type: "string" },
      city: { type: "string" },
      state: { type: "string" },
      zipCode: { type: "string" },
      country: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        userId: { type: "integer" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        dateOfBirth: { type: "string", format: "date" },
        streetAddress: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        zipCode: { type: "string" },
        country: { type: "string" },
      },
    },
  },
  ...errors
};

const updateUser = {
  body: {
    type: "object",
    properties: {
      id: { type: "integer" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      dateOfBirth: { type: "string", format: "date" },
      streetAddress: { type: "string" },
      city: { type: "string" },
      state: { type: "string" },
      zipCode: { type: "string" },
      country: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        id: { type: "integer" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        dateOfBirth: { type: "string", format: "date" },
        streetAddress: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        zipCode: { type: "string" },
        country: { type: "string" },
        updatedAt: { type: "string", format: "date-time" }
      },
    },
    ...errors
  },
};

const updateCredentials = {
  body: {
    type: "object",
    required: ["email"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" }
    }
  },
  response: {
    200: {
      email: { type: "string", format: "email" },
      message: { type: "string" }
    },
    ...errors
  }
}

const deleteUser = {
  response: {
    404: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

export default {
  allUsers,
  userById,
  createUser,
  updateUser,
  updateCredentials,
  deleteUser,
};
