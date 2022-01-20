import UserTeams from "../../db/models/userTeams.model.js";
import UserActivities from "../../db/models/userActivities.model.js";
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

export async function checkActivitiesPriviledgePlugin(fastify, options) {
  fastify.decorate("checkActivitiesPriviledge", async function(request, reply) {
    try {
      const allowedRoleRoutes = {
        Athlete: ["/activities/team/me"],
        Coach: ["/activities/team/me", "/activities/team/:teamId"],
        Trainer: ["/activities/team/me", "/activities/team/:teamId"],
        Physio: ["/activities/team/me", "/activities/team/:teamId"],
      };

      // Check for user_id and team_role from userTeams via userActivities
      // Check Request method
      // UPDATE / DELETE Only allowed if created by the request making user.



      if(!request.user.roles.includes("admin")) {
      }
    } catch (error) {
      
    }
  })
}
