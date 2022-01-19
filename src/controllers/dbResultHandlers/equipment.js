
function allEq(dbRows) {
  const data = dbRows.reduce((acc, currentVal) => {
    if (acc.length > 0 && acc[acc.length - 1][0].id === currentVal.id) {
      acc[acc.length - 1].push(currentVal);
    } else {
      acc.push([currentVal]);
    }
    return acc;
  }, [])
  .map((sublist) => {
    const id = sublist[0].id;
    const equipmentName = sublist[0].equipmentName;
    const equipmentInfo = sublist[0].equipmentInfo;
    const trainingModality = sublist[0].trainingModality;
    const exercises = sublist.map((ex) => {
      return {
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        exerciseInfo: ex.exerciseInfo,
        exerciseVariations: ex.exerciseVariations,
        exercisePositions: ex.exercisePositions,
        exerciseInformation: ex.exerciseInformation
      }
    });
    return { id, equipmentName, trainingModality, equipmentInfo, exercises };
  });

  return { count: data.length, data }
}

function byIdEq(dbRows) {
  if(dbRows.length > 1) {
    return {
      id: dbRows[0].id,
      equipmentName: dbRows[0].equipmentName,
      equipmentInfo: dbRows[0].equipmentInfo,
      trainingModality: dbRows[0].trainingModality,
      exercises: dbRows.map((ex) => {
        return {
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          exerciseInfo: ex.exerciseInfo,
          exerciseVariations: ex.exerciseVariations,
          exercisePositions: ex.exercisePositions,
          exerciseInformation: ex.exerciseInformation,
        };
      })
    }
  } else {
    return {
      id: dbRows[0].id,
      equipmentName: dbRows[0].equipmentName,
      trainingModality: dbRows[0].trainingModality,
      equipmentInfo: dbRows[0].equipmentInfo,
      exercises: [
        {
          exerciseId: dbRows[0].exerciseId,
          exerciseName: dbRows[0].exerciseName,
          exerciseInfo: dbRows[0].exerciseInfo,
          exerciseVariations: dbRows[0].exerciseVariations,
          exercisePositions: dbRows[0].exercisePositions,
          exerciseInformation: dbRows[0].exerciseInformation
        },
      ],
    };
  }
}

export default {
  allEq, byIdEq
}