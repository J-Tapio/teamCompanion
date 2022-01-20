import errorHandler from "../tools/dbErrors.js";
import UserActivities from "../../db/models/userActivities.model.js";

async function allActivities(request, reply) {
  try {
    const data = await UserActivities.query()
      .joinRelated({ activities: true })
      .select(
        "userActivities.id",
        "userActivities.athleteId",
        "userActivities.activityId",
        "activities.activityType",
        "userActivities.activityStart",
        "userActivities.activityEnd",
        "userActivities.rpeValue",
        "userActivities.createdBy",
        "staff.firstName as staffFirstName",
        "staff.LastName as staffLastName",
        "staff.userId as staffId",
        "athlete.firstName as athleteFirstName",
        "athlete.lastName as athleteLastName",
        "athlete.userId as athleteUserId"
      )
      .join(
        "userTeams as staffTeam",
        "userActivities.createdBy",
        "=",
        "staffTeam.id"
      )
      .innerJoin(
        "userInformation as staff",
        "staffTeam.userId",
        "=",
        "staff.userId"
      )
      .join(
        "userTeams as athleteTeam",
        "userActivities.athleteId",
        "=",
        "athleteTeam.id"
      )
      .innerJoin(
        "userInformation as athlete",
        "athleteTeam.userId",
        "=",
        "athlete.userId"
      )
    reply.send()
  } catch (error) {
    errorHandler(error, reply)
  }
}

async function userActivityById(request, reply) {
  try {
    let userActivity = await UserActivities.query()
      .findById(request.params.activityId)
      .first()
      .throwIfNotFound();
    delete userActivity.createdAt;
    delete userActivity.updatedAt;

    reply.send(userActivity)
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createUserActivity(request, reply) {
  try {
    let newUserActivity = await UserActivities.query()
      .insert(request.body)
      .returning("*")
      .first()
    delete newUserActivity.updatedAt;

    reply.send(newUserActivity);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateUserActivity(request, reply) {
  try {
    const updatedActivity = await UserActivities
      .query()
      .patch(request.body)
      .first()

    reply.send(updatedActivity);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteUserActivity(request, reply) {
  try {
    await UserActivities.query().deleteById(request.params.id);
    reply.status(204);
  } catch (error) {
    errorHandler(error, reply);
  }
}

export default {
  allActivities,
  userActivityById,
  createUserActivity,
  updateUserActivity,
  deleteUserActivity
}