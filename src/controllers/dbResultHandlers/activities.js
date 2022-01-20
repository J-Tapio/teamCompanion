
function allActivities(dbRows) {

const data = dbRows.reduce((acc, currentVal) => {
  if (acc.length > 0 && acc[acc.length - 1][0].athleteId === currentVal.athleteId) {
    acc[acc.length - 1].push(currentVal);
  } else {
    acc.push([currentVal]);
  }
  return acc;
}, []);

/*   const result = {
    id:,
    activityId:,
    activityType: ,
    activityStart:,
    activityEnd:,
    rpeValue: ,
    athlete: {
      userId: ,
      userTeamId:,
      firstName:,
      lastName:,
      teamRole: ,
    },
    createdBy: {
      userId:,
      userTeamId:,
      firstName:,
      lastName:,
      teamRole: ,
    }
  } */

}