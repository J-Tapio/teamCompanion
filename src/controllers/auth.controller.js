// TODO: Come back to this later after demo-app proves to be functional.
import Users from "../../db/models/users.model";
import errorHandler from "../lib/errorHandler";

async function verifyAccount(request, reply) {
  try {
    let {id, email} = fastify.jwt.verify(request.query.token);
    await Users.query().insert({emailStatus: "active"})
      .where({id, email})
      .throwIfNotFound();

    //? Logic after this in overall?
  } catch (error) {
    errorHandler(error, reply);
  }
}