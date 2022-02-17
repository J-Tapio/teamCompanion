
export default class FitnessQueryFormatter {
  static #exerciseSetObject(dbRow) {
    return {
      exerciseSetId: dbRow.exerciseSetId,
      assignedExWeight: dbRow.assignedExWeight,
      assignedExRepetitions: dbRow.assignedExRepetitions,
      assignedExDuration: dbRow.assignedExDuration,
      assignedExDistance: dbRow.assignedExDistance,
      assignedExVariation: dbRow.assignedExVariation,
      assignedSetDone: dbRow.assignedSetDone,
      assignedSetDonePartially: dbRow.assignedSetDonePartially,
      completedExWeight: dbRow.completedExWeight,
      completedExRepetitions: dbRow.completedExRepetitions,
      completedExDuration: dbRow.completedExDuration,
      completedExDistance: dbRow.completedExDistance,
      completedExSetNotes: dbRow.completedExSetNotes,
    };
  }

  static allTeamFitnessData(dbRows) {
    // dbRows sublisted per userTeamId
    let data = dbRows
      .reduce((acc, currentVal) => {
        if (
          acc.length > 0 &&
          acc[acc.length - 1][0].userTeamId === currentVal.userTeamId
        ) {
          acc[acc.length - 1].push(currentVal);
          return acc;
        } else {
          acc.push([currentVal]);
          return acc;
        }
      }, [])
      // sublistByUserTeamId sublisted by userTeamActivityId
      .map((sublistByUserTeamId) => {
        return sublistByUserTeamId.reduce((acc, currentVal) => {
          if (
            acc.length > 0 &&
            acc[acc.length - 1][0].userTeamActivitiesId ===
              currentVal.userTeamActivitiesId
          ) {
            acc[acc.length - 1].push(currentVal);
            return acc;
          } else {
            acc.push([currentVal]);
            return acc;
          }
        }, []);
      })

      // Sub-arrays of teamMembers to single object
      // Object is overall information about team member,
      // and assigned fitness activities
      .map((userTeamMember) => {
        return {
          teamMember: {
            userTeamId: userTeamMember[0][0].userTeamId,
            firstName: userTeamMember[0][0].firstName,
            lastName: userTeamMember[0][0].lastName,
            teamRole: userTeamMember[0][0].teamRole,
          },
          fitnessActivities: userTeamMember.map((fitnessActivity) => {
            return {
              userTeamActivitiesId: fitnessActivity[0].userTeamActivitiesId,
              rpeValue: fitnessActivity[0].rpeValue,
              exercises: fitnessActivity.reduce((acc, currentVal) => {
                if (
                  acc.length > 0 &&
                  acc[acc.length - 1].exercisesEquipmentId ===
                    currentVal.exercisesEquipmentId
                ) {
                  acc[acc.length - 1].exerciseSets.push(
                    this.#exerciseSetObject(currentVal)
                  );

                  acc[acc.length - 1].exerciseSetsAmount =
                    acc[acc.length - 1].exerciseSets.length;

                  return acc;
                } else {
                  acc.push({
                    exercisesEquipmentId: currentVal.exercisesEquipmentId,
                    exerciseName: currentVal.exerciseName,
                    equipmentName: currentVal.equipmentName,
                    exerciseSets: [this.#exerciseSetObject(currentVal)],
                    exerciseSetsAmount: 1,
                  });
                  return acc;
                }
              }, []),
            };
          }),
        };
      });

    return data;
  }

  static exerciseSetsByActivityAndTeamMember(dbRow) {
    let formatResult = this.allTeamFitnessData(dbRow)[0];
    return {
      data: [
        {
          teamMember: formatResult.teamMember,
          fitnessActivity: formatResult.fitnessActivities[0]
        }
      ]
    }
  }
}