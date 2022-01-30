import fastify from "../../../app.js";
import Exercises from "../../../db/models/exercises.model.js";
import Equipment from "../../../db/models/equipment.model.js";
import Teams from "../../../db/models/teams.model.js";

//! Valid but in some sense naming could be better.
//TODO: Refactor later. Check also if one can fix the fastify.method issue within route handler.

function checkAdminRole(request, reply, done) {
  return fastify.checkAdminRole(request, reply, done);
}

function checkTrainingAdminRole(request, reply) {
  return fastify.checkTrainingAdminRole(request, reply);
}

function checkStaffAdminRole(request, reply) {
  return fastify.checkStaffAdminRole(request, reply);
}

function checkActivitiesPriviledge(request, reply) {
  return request.checkActivitiesPriviledge(request, reply);
}

async function checkResourceCreator(request, reply) {
  if (!request.user.roles.includes("admin")) {
    const resourceModels = {
      exercises: Exercises,
      equipment: Equipment,
      teams: Teams,
    };

    const resourceModel = resourceModels[request.url.split("/")[1]];

    const resourceExists = await resourceModel.query().where({
      id: request.params.id,
    });

   //TODO: TeamActivities needs additional query for createdBy.

    const resourceByCreatorExists = await resourceModel.query().where({
      id: request.params.id,
      createdBy: request.user.id,
    });

    resourceExists.length === 0 && reply.notFound();
    resourceByCreatorExists.length === 0 && reply.forbidden();
  }
}

export default {
  checkAdminRole,
  checkTrainingAdminRole,
  checkStaffAdminRole,
  checkResourceCreator,
  checkActivitiesPriviledge,
};
