export default class ActivitiesResultFormatter {
  // Activity object structure
  static #activityObjectStructure(dbRow) {
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
          participants: this.#allocateParticipantByRole(dbRow)
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
  static #participantObjectStructure(dbRow) {
    return {
      userTeamId: dbRow.participantUserTeamId,
      firstName: dbRow.participantFirstName,
      lastName: dbRow.participantLastName,
      teamRole: dbRow.participantTeamRole,
    };
  }

  // Allocation of dbRow(user) by teamRole within a team
  static #allocateParticipantByRole(dbRow) {
    let participants = {
      coaches: [],
      trainers: [],
      physiotherapists: [],
      athletes: [],
      staff: [],
    }
    switch (dbRow.participantTeamRole) {
      case "Coach":
        participants.coaches
          .push(this.#participantObjectStructure(dbRow));
        break;
      case "Athlete":
        participants.athletes
          .push(this.#participantObjectStructure(dbRow));
        break;
      case "Physiotherapist":
        participants.physiotherapists
          .push(this.#participantObjectStructure(dbRow));
        break;
      case "Trainer":
        participants.trainers
          .push(this.#participantObjectStructure(dbRow));
        break;
      case "Staff":
        participants.staff
          .push(this.#participantObjectStructure(dbRow));
        break;
    }
    return participants;
  }

  // Format & allocate dbRow by activityType to specific activity array. 
  static teamActivities(dbRows) {
    let activities = {
      teamMatch: [],
      teamPractise: [],
      teamMeeting: [],
      fitness: [],
      rehabilitation: []
    }
    
    let activityObjectStructure = this.#activityObjectStructure.bind(this);

    dbRows.forEach(function allocateToActivities(activity) {
      switch(activity.activityType) {
        case "TeamMatch":
          activities.teamMatch
            .push(activityObjectStructure(activity));
          break;
        case "TeamPractise":
          activities.teamPractise
            .push(activityObjectStructure(activity));
          break;
        case "TeamMeeting":
          activities.teamMeeting
            .push(activityObjectStructure(activity));
          break;
        case "Fitness":
          activities.fitness
            .push(activityObjectStructure(activity));
          break;
        case "Rehabilitation":
          activities.rehabilitation
            .push(activityObjectStructure(activity));
          break;
      }
    });

    return activities;
  }


  static teamActivitiesParticipants(dbRows) {
  // Reduce database row data array to sub-lists which contain 
  // object's related to specific activityType
  let activityTypes = this.teamActivities(dbRows);
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


  static teamActivityById(dbRows) {
    let activityObjectStructure = this.#activityObjectStructure.bind(this);
    return dbRows
      .map(function(dbRow) { return activityObjectStructure(dbRow) })
      .reduce((acc, currentVal) => {
        for (const key in acc.participants) {
          acc.participants[key].push(...currentVal.participants[key]);
        }
        return acc;
    });
  }

  static teamActivitiesByUserTeamId(dbRows) {
    return {data: this.teamActivities(dbRows)}
  }
}