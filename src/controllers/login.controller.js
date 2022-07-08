import fastify from "../../app.js";
import Users from "../../db/models/users.model.js";

export async function loginUser(request, reply) {
  try {
    const accessToken = fastify.jwt.sign(
      {id: request.user.id, roles: [request.user.role]}, 
      {expiresIn: "1 day"}
    );
    const refreshToken = fastify.jwt.sign(
      {id: request.user.id, roles: [request.user.role]}, 
      {expiresIn: "10 days"}
    );

    await Users.query()
    .patch({refreshToken})
    .where("users.id", request.user.id);
    
    reply.status(200).send({accessToken, refreshToken});
  } catch (error) {
    console.log(error);
  }
}

