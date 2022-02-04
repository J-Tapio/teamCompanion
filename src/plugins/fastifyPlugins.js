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
        })
        .set("/activities/team/:teamId/activity/fitness/:activityId", {
          GET: allTeamRoles,
          POST: _.without(allTeamRoles, "Athlete", "Staff"),
          PUT: _.without(allTeamRoles, "Athlete", "Staff"),
        })


      if (!request.user.roles.includes("admin")) {
        // Check the teamRole of a user:
        const teamMember = await UserTeams.query()
          .select("id", "teamRole")
          .where({
            teamId: request.params.teamId,
            userId: request.user.id,
          })
          .first()
          .throwIfNotFound();

        console.log(teamMember);

        if(!teamMember) {
          // Request user not part of the team
          reply.forbidden();
        } else {
          const {id, teamRole} = teamMember;
          const route = request.context.config.url;
          const method = request.method;
          // Athlete should be only allowed to see activities where participant
          if (
            teamRole === "Athlete" && 
            allowedRolesAndMethods.get(route)[method].includes("Athlete")
          ) {
            // Routes, which need userTeamId === request user's userTeamId check.
            let checkForUserTeamIdRoutes = [
              "/activities/team/:teamId/activity/fitness/member/:userTeamId",
              "/activities/team/:teamId/activity/:activityId/fitness/member/:userTeamId/exercises",
            ];
            
            let isParticipantOfActivity = await UserTeamActivities.query()
              .where({
                userTeamId: id,
                ...(route !== checkForUserTeamIdRoutes[0] &&
                  {teamActivityId: request.params.activityId}
                )
              })
              .returning("id, userTeamId")
              .first();

              // Requesting user might be participant but requesting with wrong userTeamId (not the same as request user has)
              if (
                checkForUserTeamIdRoutes.includes(route)
                && 
                isParticipantOfActivity.userTeamId !==
                parseInt(request.params.userTeamId) 
              ) {
                reply.forbidden();
              } else {
                request.user.teamRole = teamRole;
                request.user.userTeamId = id;
              }

          } else {
            // Check the priviledges per method & route of HTTP-request:
            // Include additional information to user property on request
            if (
              allowedRolesAndMethods.get(route)[method].includes(teamRole)
            ) {
              request.user.teamRole = teamRole,
              request.user.userTeamId = id;
            } else {
              reply.forbidden();
            }
          }
        }
      }
    } catch (error) {
      errorHandler(error, reply);
    }
  })
}
