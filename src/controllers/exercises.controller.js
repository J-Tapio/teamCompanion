import ExercisesQueries from "../controllers/dbQueries/exercises.queries.js";
import errorHandler from "../lib/errorHandler.js";


async function allExercises(request, reply) {
  try {
    let data = await ExercisesQueries.allExercises();
    reply.send(data);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function exerciseById(request, reply) {
  try {
    let exercise = await ExercisesQueries.exerciseById({
      exerciseId: parseInt(request.params.id)
    });
    reply.send(exercise);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createExercise(request, reply) {
  try {
    let createdExercise = await ExercisesQueries.createExercise({
      userId: request.user.id,
      exerciseInformation: request.body
    });
    reply.status(201).send(createdExercise);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateExercise(request, reply) {
  try {
    let updatedExercise = await ExercisesQueries.updateExercise({
      exerciseId: parseInt(request.params.id),
      requestUserId: request.user.id,
      updateInformation: request.body
    });
    
    reply.send(updatedExercise);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function deleteExercise(request, reply) {
  try {
    await ExercisesQueries.deleteExercise({
      exerciseId: parseInt(request.params.id)
    });
    reply.status(204).send();
  } catch (error) {
    errorHandler(error, reply);
  }
}

// Exercises and Equipment individually
async function allExEq(request, reply) {
  try {
    let data = await ExercisesQueries.allExercisesAndEquipment();
    reply.send({data});
  } catch (error) {
    errorHandler(error, reply);
  }
}

//!28.07.2022 Added.
//TODO: Write tests for this implementation
async function exerciseToEquipmentId(request, reply) {
  try {
    let equipmentId = request.query.equipmentId;
    let exerciseId = request.query.exerciseId;
    let {id} = await ExercisesQueries.exerciseToEquipmentId(equipmentId, exerciseId);

    reply.send({exercisesEquipmentId: id});
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createExEq(request, reply) {
  try {
    let newExerciseEquipment = await ExercisesQueries
      .createExerciseEquipment({
        userId: request.user.id,
        exerciseId: parseInt(request.body.exerciseId) || null,
        equipmentId: parseInt(request.body.equipmentId) || null,
        data: request.body
      })
    reply.status(201).send(newExerciseEquipment);
  } catch (error) {
    errorHandler(error, reply);
  }
}



export default {
  allExercises,
  exerciseToEquipmentId,
  exerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  allExEq,
  createExEq
};