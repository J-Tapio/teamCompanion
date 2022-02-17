import registerUser from "../controllers/register.controller.js";
import registerSchema from "../controllers/validationSchemas/register.schema.js";


export default {
  method: "POST",
  url: "/register",
  schema: registerSchema.registerUser,
  handler: registerUser,
  config: {
    description: "Register User"
  }
}