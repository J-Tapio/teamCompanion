import Users from "../../db/models/users.model.js";
import errorHandler from "../lib/errorHandler.js";
import {generatePasswordHash} from "../tools/passwordHash.js";
//import sendVerificationEmail from "../lib/emailVerification.js";

async function registerUser(request, reply) {
  try {
    // Email verification on user email
    // Register user, send email verification
    // Email verification should just verify email in the backend
    // Sign token, attach it to link

    let hashedPassword = await generatePasswordHash(request.body.password);
    let {id, email, password} = await Users.query()
      .insert({
        email: request.body.email, 
        password: hashedPassword,
        emailStatus: "pending"
      })
      .returning("*");

    // TODO: Implement later if proceeding further than demo
    if(process.env.NODE_ENV !== "development") {
      let accountVerificationToken = fastify.jwt.sign(
          {id, email}, 
          {expiresIn: "30min"}
        );
      sendVerificationEmail(email, accountVerificationToken); 
    }

    reply.status(201).send({
      message: "Email verification for account has been sent"
    })
  } catch (error) {
    errorHandler(error, reply);
  }
}

export default registerUser;
