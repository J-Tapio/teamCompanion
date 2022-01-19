
function teamInformation(dbRows) {

  const {teamId, teamName, streetAddress, city, zipCode, state, country } = dbRows[0];

  const coaches = dbRows.filter((member) => member.teamRole === "Coach");
  const trainers = dbRows.filter((member) => member.teamRole === "Trainer");
  const athletes = dbRows.filter((member) => member.teamRole === "Athlete");
  const physiotherapists = dbRows.filter((member) => member.teamRole === "Physiotherapist");
  const staff = dbRows.filter((member) => member.teamRole === "Staff");

  return {
    teamId,
    teamName,
    teamAddress: {
      streetAddress,
      city,
      zipCode,
      state,
      country,
    },
    teamMembers: {
      coaches: coaches.length ? coaches : null,
      trainers: trainers.length ? trainers : null,
      athletes: athletes.length ? athletes : null,
      physiotherapists: physiotherapists.length ? physiotherapists : null,
      staff: staff.length ? staff : null,
    }
  }
}

export default {
  teamInformation
}

