//Activity object structure
function activityObjectStructure(dbRow) {
  return {
    id: dbRow.id,
    activityTypeId: dbRow.activityTypeId,
    activityType: dbRow.activityType,
    activityStart: dbRow.activityStart,
    activityEnd: dbRow.activityEnd,
    activityNotes: dbRow.activityNotes,
    ...(dbRow.activityTypeId === 1 && {
      opponent: {
        opponentName: dbRow.opponentName,
        opponentLogo: dbRow.opponentLogo,
      },
    }),
    ...(dbRow.venueId && {
      venue: {
        venueId: dbRow.venueId,
        venueName: dbRow.venueName,
        streetAddress: dbRow.streetAddress,
        zipCode: dbRow.zipCode,
        city: dbRow.city,
        state: dbRow.state,
        country: dbRow.country,
      },
    }),
    ...(dbRow.participantUserTeamId && 
      {
        participants: allocateParticipantByRole(dbRow)
      }),
    createdBy: {
      userTeamId: dbRow.createdByUserTeamId,
      firstName: dbRow.createdByFirstName,
      lastName: dbRow.createdByLastName,
      teamRole: dbRow.createdByTeamRole,
    },
    createdAt: dbRow.createdAt,
  };
}

//Participant object structure
function participantObjectStructure(dbRow) {
  return {
    userTeamId: dbRow.participantUserTeamId,
    firstName: dbRow.participantFirstName,
    lastName: dbRow.participantLastName,
    teamRole: dbRow.participantTeamRole,
  };
}

// Allocation of dbRow(user) by teamRole within a team
function allocateParticipantByRole(dbRow) {
  let participants = {
    coaches: [],
    trainers: [],
    physiotherapists: [],
    athletes: [],
    staff: [],
  }
  switch (dbRow.participantTeamRole) {
    case "Coach":
      participants.coaches.push(participantObjectStructure(dbRow));
      break;
    case "Athlete":
      participants.athletes.push(participantObjectStructure(dbRow));
      break;
    case "Physiotherapist":
      participants.physiotherapists
      .push(participantObjectStructure(dbRow));
      break;
    case "Trainer":
      participants.trainers.push(participantObjectStructure(dbRow));
      break;
    case "Staff":
      participants.staff.push(participantObjectStructure(dbRow));
      break;
  }
  return participants;
}

// Format & allocate dbRow by activityType to specific activity array. 
function teamActivities(dbRows) {
  let activities = {
    teamMatch: [],
    teamPractise: [],
    teamMeeting: [],
    fitness: [],
    rehabilitation: []
  }

  dbRows.forEach((activity) => {
    switch(activity.activityType) {
      case "TeamMatch":
        activities.teamMatch.push(activityObjectStructure(activity));
        break;
      case "TeamPractise":
        activities.teamPractise.push(activityObjectStructure(activity));
        break;
      case "TeamMeeting":
        activities.teamMeeting.push(activityObjectStructure(activity));
        break;
      case "Fitness":
        activities.fitness.push(activityObjectStructure(activity));
        break;
      case "Rehabilitation":
        activities.rehabilitation.push(activityObjectStructure(activity));
        break;
    }
  })

  return activities;
}


function teamActivitiesParticipants(dbRows) {
  // Reduce database row data to lists which contain 
  // object's related to specific activityType
  let activityTypes = teamActivities(dbRows);
    // Reduce actitivityTypes array objects to sub-lists by teamActivity id:
    for(const key in activityTypes) {
      activityTypes[key] = activityTypes[key]
        .reduce((acc, currentVal) => {
          if (acc.length > 0 && acc[acc.length - 1][0].id === currentVal.id) {
            acc[acc.length - 1].push(currentVal);
          } else {
            acc.push([currentVal]);
          }
          return acc;
        }, [])
      // Reduce sublists to single object(s)
        .map((sublistByActivityId) => {
          return sublistByActivityId.reduce((acc, currentVal) => {
            for(const key in acc.participants) {
              acc.participants[key].push(...currentVal.participants[key])
            }
            return acc;
          })
      })
    }
    return activityTypes;
  }


function teamActivityById(dbRows) {
  return dbRows
    .map((dbRow) => activityObjectStructure(dbRow))
    .reduce((acc, currentVal) => {
      for (const key in acc.participants) {
        acc.participants[key].push(...currentVal.participants[key]);
      }
      return acc;
  });
}

function teamActivityByUserTeamId(dbRows) {
  return teamActivities(dbRows);
}


export default {
  teamActivities,
  teamActivitiesParticipants,
  teamActivityById,
  teamActivityByUserTeamId,
}