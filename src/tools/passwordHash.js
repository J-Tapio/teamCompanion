import fastify from "../../app.js";

export async function generatePasswordHash(password) {
  try {
    const hashedPassword = await fastify.bcrypt.hash(password);
    return hashedPassword;
  } catch (error) {
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
    throw new Error(error)
  }
}