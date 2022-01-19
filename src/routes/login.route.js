import { verifyUserAndPassword } from "../tools/auth.js";
import { loginUser } from "../controllers/login.controller.js";

const loginValidation = {
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
        accessToken: { type: "string" },
        refreshToken: { type: "string" }
      }
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  }
}


export default {
  method: "POST",
  url: "/login",
  schema: loginValidation,
  preHandler: verifyUserAndPassword,
  handler: loginUser,
  config: {
    description: "User Login"
  }
}