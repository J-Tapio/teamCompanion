import registerUser from "../controllers/register.controller.js";

const registerValidation = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: {type: "string"}
      }
    }
  }
}

export default {
  method: "POST",
  url: "/register",
  schema: registerValidation,
  handler: registerUser,
  config: {
    description: "Register User"
  }
}