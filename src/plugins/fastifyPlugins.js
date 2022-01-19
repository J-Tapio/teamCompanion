import UserTeams from "../../db/models/userTeams.model.js";
import fastifyJwt from "fastify-jwt";
import errorHandler from "../tools/dbErrors.js";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export async function authPlugin(fastify, options) {
  fastify.register(fastifyJwt, {
    formatUser: function (user) {
      return { id: user.id, roles: user.roles };
    },
    secret: process.env.JWT_SECRET,
  });

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.badRequest(error.message);
    }
  });
}

export async function checkStaffAdminRolePlugin(fastify, options) {
  fastify.decorate("checkStaffAdminRole", async function (request, reply) {
    try {
      if (!request.user.roles.includes("admin")) {
        const allowedRoles = await UserTeams.query().where(function (builder) {
          builder
            .where({
              userId: request.user.id,
              teamId: request.params.id,
            })
            .whereIn("teamRole", ["Coach", "Staff"]);
        });

        if (allowedRoles.length === 0) {
          reply.forbidden();
        }
      }
    } catch (error) {
      errorHandler(error, reply);
    }
  });
}

export async function checkTrainingAdminRolePlugin(fastify, options) {
  fastify.decorate("checkTrainingAdminRole", async function (request, reply) {
    try {
      if (!request.user.roles.includes("admin")) {
        const allowedRoles = await UserTeams.query()
          .where((builder) =>
            builder
              .where("userId", request.user.id)
              .whereIn("teamRole", ["Coach", "Trainer"])
          )
          .select("teamRole");
        if (allowedRoles.length === 0) {
          reply.forbidden();
        }
      }
    } catch (error) {
      errorHandler(error, reply);
    }
  });
}
