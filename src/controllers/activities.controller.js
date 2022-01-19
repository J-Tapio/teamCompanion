import errorHandler from "../tools/dbErrors.js";
import Activities from "../../db/models/activities.model.js";

async function allActivites(request, reply) {
  try {
    const data = await Activities.query()
      .select(
        "id",
        "userId",
        "teamId",
        "activityType",
        "activityStart",
        "activityEnd",
        "rpeValue",
        "createdBy"
      )
      .throwIfNotFound();

      reply.send({count: data.length, data});
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createActivity(request, reply) {
  try {
    const {
      id, 
      userId, 
      teamId, 
      activityType, 
      activityStart, 
      activityEnd, 
      rpeValue, 
      createdBy, 
      createdAt
    } = await Activities.query()
      .insert({...request.body, createdBy: request.user.id});
    
    reply.send({
      id, 
      userId, 
      teamId, 
      activityType, 
      activityStart, 
      activityEnd, 
      rpeValue, 
      createdBy, 
      createdAt
    });
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function activityById(request, reply) {
  try {
    const activity = await Activities.query()
      .where("id", request.params.id)
      .select(
        "id", 
        "userId", 
        "teamId", 
        "activityStart", 
        "activityEnd", 
        "rpeValue", 
        "createdBy", 
        "createdAt"
        )
      .first()
      .throwIfNotFound();

    reply.send(activity)
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateActivity(request, reply) {
  try {
    const updatedActivity = await Activities.query()
      .where("id", request.params.id)
      .patch(request.body)
      .returning( "id", 
        "userId", 
        "teamId", 
        "activityStart", 
        "activityEnd", 
        "rpeValue", 
        "createdBy",
        "updatedAt"
        )
        .first()
        .throwIfNotFound();

      reply.send(updateActivity);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteActivity(request, reply) {
  try {
    await Activities.query().deleteById(request.params.id).throwIfNotFound()
    reply.status(204);
  } catch (error) {
    errorHandler(error, reply);
  }
}