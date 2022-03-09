import errors from "./errors.schema.js";

/**
 * Pattern for email validation with regex from:
 * https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength
 * 
 * ^                         Start anchor
 * (?=.*[A-Z].*[A-Z])        Ensure string has two uppercase letters or more.
 * (?=.*[!@#$&*])            Ensure string has one special case letter or more.
 * (?=.*[0-9].*[0-9])        Ensure string has two digits or more.
 * (?=.*[a-z].*[a-z].*[a-z]) Ensure string has three lowercase letters or more.
 * .{8}                      Ensure string is of length 8 or more.
 * $                         End anchor.
 */

let registerUser = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: {
        type: "string",
        pattern:
          "^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()-__+.]){1,}).{8,}$",
      },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    ...errors,
  },
};

export default {
  registerUser,
}