
async function allTeamVenues(request, reply) {
  try {
    const data = await Venues.query().where("teamId", request.params.teamId);
    reply.send({ count: data.length, data });
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createTeamVenue(request, reply) {
  try {
    const {
      id,
      venueName,
      streetAddress,
      zipCode,
      city,
      state,
      country,
      teamId,
      createdAt,
    } = await Venues.query().insert(request.body).returning("*");

    reply.send({
      id,
      venueName,
      streetAddress,
      zipCode,
      city,
      state,
      country,
      teamId,
      createdAt,
    });
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateTeamVenue(request, reply) {
  try {
    const updatedTeamVenue = await Venues.query()
      .where("id", request.params.venueId)
      .patch(request.body)
      .returning(
        "id",
        "venueName",
        "streetAddress",
        "zipCode",
        "city",
        "state",
        "country",
        "teamId",
        "updatedAt"
      )
      .first()
      .throwIfNotFound();

    reply.send(updatedTeamVenue);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteTeamVenue(request, reply) {
  try {
    await Venues.query().del().where("id", request.params.venueId);
    reply.status(204);
  } catch (error) {
    errorHandler(error, reply);
  }
}

export default {
  allTeamVenues,
  createTeamVenue,
  updateTeamVenue,
  deleteTeamVenue
}