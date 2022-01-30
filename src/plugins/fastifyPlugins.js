import UserTeams from "../../db/models/userTeams.model.js";
import fastifyJwt from "fastify-jwt";
import errorHandler from "../tools/dbErrors.js";
import dotenv from "dotenv";
import TeamActivities from "../../db/models/teamActivities.model.js";
import UserTeamActivities from "../../db/models/userTeamActivities.model.js";
import _ from "lodash";

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
  fastify.decorateRequest("checkActivitiesPriviledge", async function(request, reply) {
    try {

      let teamRoles = [
        "Coach", "Trainer", "Physiotherapist", "Staff", "Athlete"
      ]

      let allowedRolesAndMethods = new Map();
      allowedRolesAndMethods
        .set("/activities/team/:teamId", {
          GET: _.without(teamRoles, "Athlete"),
          POST: _.without(teamRoles, "Athlete"),
        })
        .set("/activities/team/:teamId/activity/:activityId", {
          GET: teamRoles,
          PUT: _.without(teamRoles, "Athlete"),
          DELETE: _.without(teamRoles, "Athlete"),
        })
        .set("/activities/team/:teamId/member/:userTeamId", {
          GET: teamRoles,
        })
        .set("/activities/team/:teamId/activity/:activityId/participants", {
          POST: _.without(teamRoles, "Athlete"),
          PUT: _.without(teamRoles, "Athlete"),
        });


      if (!request.user.roles.includes("admin")) {
        // Check the teamRole of a user:
        const teamMember = await UserTeams.query()
          .select("id", "teamRole")
          .where({
            teamId: request.params.teamId,
            userId: request.user.id,
          })
          .first();

        if(!teamMember) {
          // Request user not part of the team
          reply.forbidden();
        } else {
          const {id, teamRole} = teamMember;
          // Requested route & method
          const route = request.context.config.url;
          const method = request.method;
          // Athlete should be only allowed to see activities where participant
          if (
            teamRole === "Athlete" && 
            allowedRolesAndMethods.get(route)[method].includes("Athlete")
          ) {
            let isParticipantOfActivity = await UserTeamActivities.query()
              .where({
                userTeamId: id,
                teamActivityId: request.params.activityId,
              })
              .returning("id")
              .first();

            !isParticipantOfActivity && reply.forbidden();
          } else {
            // Check the priviledges per method & route of HTTP-request:
            // Include additional information to user property on request
            allowedRolesAndMethods.get(route)[method].includes(teamRole) &&
            ((request.user.teamRole = teamRole),
            (request.user.userTeamId = id));

            !allowedRolesAndMethods.get(route)[method].includes(teamRole) &&
            reply.forbidden();
          }
        }
      }
    } catch (error) {
      errorHandler(error, reply);
    }
  })
}
