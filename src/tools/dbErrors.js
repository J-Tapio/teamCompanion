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
   } else {
    reply.internalServerError();
  }
}

//TODO: Refactor later to Switch-Case function
