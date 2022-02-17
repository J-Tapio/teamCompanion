export default class AppError extends Error {
  constructor(message, statusCode = 500, ...params) {
    // Pass remaining arguments to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown
    // Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    this.name = "AppError";
    // Custom debugging information
    this.message = message;
    this.statusCode = statusCode;
  }

  /* toJSON() {
    return {
      msg: this.message,
      status: this.statusCode,
    };
  } */
}
