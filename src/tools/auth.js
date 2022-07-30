import Users from "../../db/models/users.model.js";
import errorHandler from "../lib/errorHandler.js";
import {comparePasswords} from "./passwordHash.js";

export async function verifyUserAndPassword(request, reply) {
  try {
    if (!request.body || !request.body.password || !request.body.email) {
      reply.badRequest("Please provide credentials.");
    }

    const user = await Users.query().findOne({
      email: request.body.email,
    });

    if(user && user.emailStatus === "pending") {
      reply.forbidden("Account not verified");
    }
    
    if (user && await comparePasswords(request.body.password, user.password)) {
      request.user = user;
    } else {
      reply.badRequest("Invalid credentials.");
    }
  } catch (error) {
    errorHandler(error, reply);
  }
}

