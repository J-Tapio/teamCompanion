import errorHandler from "../tools/dbErrors.js";

async function registerUser(request, reply) {
  try {
  } catch (error) {
    errorHandler(error, reply);
  }
}

export default registerUser;
