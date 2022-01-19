import fastify from "../../../app.js";

function authenticateUser(request, reply) {
  return fastify.authenticate(request, reply);
}

export default {
  authenticateUser,
}