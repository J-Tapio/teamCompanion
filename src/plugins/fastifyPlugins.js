import UserTeams from "../../db/models/userTeams.model.js";
import fastifyJwt from "fastify-jwt";
import errorHandler from "../tools/dbErrors.js";
import dotenv from "dotenv";
import TeamActivities from "../../db/models/teamActivities.model.js";
import UserTeamActivities from "../../db/models/userTeamActivities.model.js";
import _ from "lodash";
import Teams from "../../db/models/teams.model.js";

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

export async function checkForUnknownUrlIdsPlugin(fastify, options) {
  fastify.decorate("checkForUnknownUrlIds", async function(request,reply) {
    try {
      // Check if team exists:
      await Teams.query().where("id", request.params.teamId).throwIfNotFound();

      if (
        request.params.activityId && 
        request.params.teamId && 
        request.params.userTeamId
        ) {
        await TeamActivities.query()
          .where("id", request.params.activityId)
          .andWhere("teamId", request.params.teamId)
          .throwIfNotFound();
        await UserTeams.query()
          .where("id", request.params.userTeamId)
          .andWhere("teamId", request.params.teamId)
          .throwIfNotFound();
      } else if (
        request.params.teamId && 
        !request.params.activityId && 
        request.params.userTeamId
        ) {
          await UserTeams.query()
            .where("id", request.params.userTeamId)
            .andWhere("teamId", request.params.teamId)
            .throwIfNotFound();
      } else if (
        request.params.teamId &&
        request.params.activityId &&
        !request.params.userTeamId
      ) {
        await TeamActivities.query()
          .where("id", request.params.activityId)
          .andWhere("teamId", request.params.teamId)
          .throwIfNotFound();
      }
    } catch (error) {
      errorHandler(error, reply);
    }
  })
}

export async function checkActivitiesPriviledgePlugin(fastify, options) {
  fastify.decorateRequest("checkActivitiesPriviledge", async function(request, reply) {
    try {

      let allTeamRoles = [
        "Coach", "Trainer", "Physiotherapist", "Staff", "Athlete"
      ]

      let allowedRolesAndMethods = new Map();
      allowedRolesAndMethods
        .set("/activities/team/:teamId", {
          GET: _.without(allTeamRoles, "Athlete"),
          POST: _.without(allTeamRoles, "Athlete"),
        })
        .set("/activities/team/:teamId/activity/:activityId", {
          GET: allTeamRoles,
          PUT: _.without(allTeamRoles, "Athlete"),
          DELETE: _.without(allTeamRoles, "Athlete"),
        })
        .set("/activities/team/:teamId/member/:userTeamId", {
          GET: allTeamRoles,
        })
        .set("/activities/team/:teamId/activity/:activityId/participants", {
          POST: _.without(allTeamRoles, "Athlete"),
          PUT: _.without(allTeamRoles, "Athlete"),
        })
        .set("/activities/team/:teamId/activity/fitness", {
          GET: _.without(allTeamRoles, "Athlete"),
        })
        .set("/activities/team/:teamId/activity/fitness/member/:userTeamId", {
          GET: allTeamRoles,
        })
        .set("/activities/team/:teamId/activity/:activityId/fitness/member/:userTeamId/exercises", {
          GET: allTeamRoles,
          PUT: _.without(allTeamRoles, "Staff"),
        })
        .set("/activities/team/:teamId/activity/fitness/:activityId", {
          GET: allTeamRoles,
          POST: _.without(allTeamRoles, "Athlete", "Staff"),
          PUT: _.without(allTeamRoles, "Athlete", "Staff"),
        })

      async function checkIfTeamMember() {
        // Check the teamRole of a user
        const teamMember = await UserTeams.query()
          .select("id", "teamRole")
          .where({
            teamId: request.params.teamId,
            userId: request.user.id,
          })
          .first();
        if(!teamMember) {
          reply.forbidden();
        } else {
          return teamMember;
        }
      }

      async function additionalChecksForAthlete(id, route, teamRole, request, reply) {
        /**
         * Request made by Athlete
         * Check if athlete updating before activityEnd
         * Check if athlete requesting own fitness activities
         * Check if athlete is participant of activity
         * Check if request.params.userTeamId equals to athlete's teamId
         */
        let requestActivityId = parseInt(request.params.activityId) || false;
        let requestUserTeamId = parseInt(request.params.userTeamId) || false;

        if(route === "/activities/:teamId/activity/:activityId/fitness/member/:userTeamId/exercises") {
          // Check if request to update made before activity has started.
          let {activityStart} = await TeamActivities.query()
          .select("activityStart")
          .where({
            id: requestActivityId,
            teamId: request.params.teamId
          })
          .first()
          let requestDate = new Date();
          let requestTimeInMilliseconds = requestDate.getTime();
          let activityStartInMilliseconds = new Date(activityStart).getTime();
  
          if(activityStartInMilliseconds > requestTimeInMilliseconds) {
            reply.badRequest("Not possible to update assigned exercises before activity has started.")
          }
        }


        if (
          route ===
          "/activities/team/:teamId/activity/fitness/member/:userTeamId" 
          &&
          requestUserTeamId !== id
        ) {
          reply.forbidden();
        }

        let isParticipantOfActivity = await UserTeamActivities.query()
          .where({
            userTeamId: id,
            ...(requestActivityId && { teamActivityId: requestActivityId }),
          })
          .returning("id, userTeamId")
          .first()

        if (
          requestUserTeamId &&
          !requestActivityId &&
          !isParticipantOfActivity
        ) {
          reply.forbidden();
        } else if (
          !requestUserTeamId &&
          requestActivityId &&
          !isParticipantOfActivity
        ) {
          reply.forbidden();
        } else if (
          requestActivityId &&
          requestUserTeamId &&
          isParticipantOfActivity.userTeamId !== requestUserTeamId
        ) {
          reply.forbidden();
        } else {
          request.user.teamRole = teamRole;
          request.user.userTeamId = id;
        }
      }

      function checksForTeamMembers(id, route, method, teamRole, reply) {
        // Check the priviledges per method & route of HTTP-request:
        // Include additional information to user property on request
        if (allowedRolesAndMethods.get(route)[method].includes(teamRole)) {
          (request.user.teamRole = teamRole), (request.user.userTeamId = id);
        } else {
          reply.forbidden();
        }
      }

      if(request.user.roles.includes("user")) {
          const {id, teamRole} = await checkIfTeamMember(request, reply);
          const route = request.context.config.url;
          const method = request.method;
          if (
            teamRole === "Athlete" && 
            allowedRolesAndMethods.get(route)[method].includes("Athlete")
          ) {
            await additionalChecksForAthlete(id, route, teamRole, request, reply);
          } else {
            checksForTeamMembers(id, route, method, teamRole, reply);
          }
      }
    } catch (error) {
      errorHandler(error, reply);
    }
  });
}
