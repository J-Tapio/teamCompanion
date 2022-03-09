export default class ExercisesQueryFormatter {

  static allExercises(dbRows) {
    /**
     * Reduce to array of sublists by exercise Id.
     * Map through sublists, return single object.
     * Object contains single exercise information.
     * Equipment property contains array of equipment related to exercise.
     */
    const data = dbRows.reduce((acc, currentVal) => {
      if (
        acc.length > 0 &&
        acc[acc.length - 1][0].id === currentVal.id
      ) {
        acc[acc.length - 1].push(currentVal);
      } else {
        acc.push([currentVal]);
      }
      return acc;
    }, [])
    .map((sublist) => {
      const id = sublist[0].id;
      const exerciseName = sublist[0].exerciseName;
      const exerciseInfo = sublist[0].exerciseInfo;
      const equipment = sublist.map((eq) => {
        return {
          equipmentId: eq.equipmentId,
          equipmentName: eq.equipmentName,
          equipmentInfo: eq.equipmentInfo,
          trainingModality: eq.trainingModality,
          exerciseVariations: eq.exerciseVariations,
          exercisePositions: eq.exercisePositions,
          exerciseInformation: eq.exerciseInformation,
        };
      });
      return { id, exerciseName, exerciseInfo, equipment };
    })
  
    return { count: data.length, data}
  }
  
  static exerciseById(dbRows) {
    /**
     * Return object, which contains exercise information
     * Equipment information may vary by amount of equipment linked to exercise
     * Hence, map needed if more rows than one (exercise related equipment > 1)
     */
    if(dbRows.length > 1) {
      return {
        id: dbRows[0].id,
        exerciseName: dbRows[0].exerciseName,
        exerciseInfo: dbRows[0].exerciseInfo,
        equipment: dbRows.map((eq) => {
        return {
          equipmentId: eq.equipmentId,
          equipmentName: eq.equipmentName,
          equipmentInfo: eq.equipmentInfo,
          trainingModality: eq.trainingModality,
          exerciseVariations: eq.exerciseVariations,
          exercisePositions: eq.exercisePositions,
          exerciseInformation: eq.exerciseInformation,
        }
        })
      };
    } else {
      return {
        id: dbRows[0].id,
        exerciseName: dbRows[0].exerciseName,
        exerciseInfo: dbRows[0].exerciseInfo,
        equipment: [{
          equipmentId: dbRows[0].equipmentId,
          equipmentName: dbRows[0].equipmentName,
          equipmentInfo: dbRows[0].equipmentInfo,
          trainingModality: dbRows[0].trainingModality,
          exerciseVariations: dbRows[0].exerciseVariations,
          exercisePositions: dbRows[0].exercisePositions,
          exerciseInformation: dbRows[0].exerciseInformation,
        }]
      }
    }
  }
}
