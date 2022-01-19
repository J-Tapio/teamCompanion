import fastify from "../../app.js";

/**
 * WILL BE USEFUL ONLY LATER WHEN CODING ROUTE FOR REGISTER/LOGIN
 * USING BCRYPTJS SEPARATELY TO GENERATE THE HASH FOR TEST USERS
 * FASTIFY BCRYPT USES BCRYPTJS...
 */

export async function generateHash(password) {
  try {
    const hashedPassword = await fastify.bcrypt.hash(password);
    return hashedPassword;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function comparePasswords(password, dbHashPassword) {
  try {
    if(await fastify.bcrypt.compare(password, dbHashPassword)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw new Error(error)
  }
}