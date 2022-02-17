import objection from "objection";
const {
  ValidationError,
  NotFoundError,
  DBError,
  ConstraintViolationError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} = objection;
import AppError from "./appError.js";

//TODO: Change filename to appErrors.js
//TODO: Extend from Error class AppError class since it is needed in some cases.

export default function errorHandler(err, reply) {
  console.log('\x1b[31m%s\x1b[0m',":::::ERROR HANDLER LOG START:::::");
  console.log(err);
  console.log('\x1b[31m%s\x1b[0m',":::::ERROR HANDLER LOG END:::::")

  if (err instanceof ValidationError) {
    switch (err.type) {
      case "ModelValidation":
        reply.badRequest();
        break;
      case "RelationExpression":
        reply.badRequest();
        break;
      case "UnallowedRelation":
        reply.badRequest();
        break;
      case "InvalidGraph":
        reply.badRequest();
        break;
      default:
        reply.badRequest();
        break;
    }
  } else if (err instanceof ConstraintViolationError) {
    reply.badRequest();

  } else if (err instanceof NotFoundError) {
    reply.notFound();

  } else if (err instanceof UniqueViolationError) {
    reply.conflict();

  } else if (err instanceof NotNullViolationError) {
    reply.notFound();

  } else if (err instanceof ForeignKeyViolationError) {
    reply.notFound();
    
  } else if (err instanceof CheckViolationError) {
    reply.notFound();
    
  } else if (err instanceof DataError) {
    reply.notFound();

  } else if (err instanceof DBError) {
   //TODO: Refactor later to just reply.badRequest()??
   //? Semantically would be more meaningful to catch some errors and 
   //? reply with information, eg. invalid properties provided etc.

    switch(err.nativeError.routine) {
      case "checkInsertTargets":
        reply.badRequest();
        // Invalid column / unknown column
        break;
      case "transformUpdateTargetList":
        // Invalid column??
        reply.badRequest();
        break;
      default:
        reply.internalServerError();
        break;
    }
  } else if(err instanceof AppError) {
    switch(err.message) {
      case "DB id matches unequal with payload data":
        reply.notFound({ message: err.message });
        break;
      case "DB id matches unequal with payload data for exercise sets":
        reply.notFound({ message: err.message });
        break;
      case "DB Transaction failed":
        reply.badRequest({ message: err.message });
        break;
      case "Sent data is missing exercise set id and/or userTeamActivitiesId":
        reply.badRequest({ message: err.message });
        break;
      case "Trying to update wrong exercise set information":
        reply.badRequest({ message: err.message });
        break;
      case "Request on resource which was not created by requesting user":
        reply.forbidden({ message: err.message });
        break;
    }
  } else {
    reply.internalServerError();
  }
}

//TODO: Refactor later to Switch-Case function
