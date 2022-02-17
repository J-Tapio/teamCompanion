import errorHandler from "../tools/dbErrors.js";

async function registerUser(request, reply) {
  try {
    // Email verification on user email
    
  } catch (error) {
    errorHandler(error, reply);
  }
}

export default registerUser;
