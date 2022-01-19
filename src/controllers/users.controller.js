import errorHandler from "../tools/dbErrors.js";
import UserInformation from "../../db/models/userInformation.model.js";
import fastify from "../../app.js";
import Users from "../../db/models/users.model.js";

async function allUsers(request, reply) {
  try {
    const data = await UserInformation.query().joinRelated("users").select("users.id", "users.email", "userInformation.firstName", "userInformation.lastName", "userInformation.dateOfBirth", "userInformation.streetAddress", "userInformation.city", "userInformation.zipCode", "userInformation.state", "userInformation.country").throwIfNotFound();
    
    reply.send({count: data.length, data});
  } catch (error) {
    errorHandler(error,reply);
  }
}


async function userById(request, reply) {
  try {
  
  const user = await UserInformation.query()
    .joinRelated("users")
    .where("users.id", request.params.id || request.user.id)
    .select(
      "users.id",
      "users.email",
      "userInformation.firstName",
      "userInformation.lastName",
      "userInformation.dateOfBirth",
      "userInformation.streetAddress",
      "userInformation.city",
      "userInformation.zipCode",
      "userInformation.state",
      "userInformation.country"
    ).first().throwIfNotFound();

    reply.send(user);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createUser(request, reply) {
  try {
    const newUser = await UserInformation.query().insert(request.body);
    reply.status(201).send(newUser);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateUser(request, reply) {
  try {
    const {
      userId,
      firstName,
      lastName,
      dateOfBirth,
      streetAddress,
      city,
      state,
      zipCode,
      country,
      updatedAt
    } = await UserInformation.query()
      .patch(request.body)
      .where("userId", request.params.id || request.user.id)
      .returning("*")
      .first()
      .throwIfNotFound();

    reply.send({
      id: userId,
      firstName,
      lastName,
      dateOfBirth,
      streetAddress,
      city,
      state,
      zipCode,
      country,
      updatedAt,
    });
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateCredentials(request, reply) {
  // Semantically more readable for me with 'var' as email is re-assigned.
    var {email, password} = request.body;

    if(email && password) {
      const hashPassword = request.body.password ? await fastify.bcrypt.hash(request.body.password) : undefined;
  
      var {email} = await Users.query().patch({
        email,
        password: hashPassword
      })
      .where("id", request.user.id)
      .returning("*")
      .first()
      .throwIfNotFound();

      reply.send({email, message: "Email and Password successfully updated."});
    } else {
      var {email} = await Users.query()
        .patch({
          email
        })
        .where("id", request.user.id)
        .returning("*")
        .first()
        .throwIfNotFound();
      reply.send({email, message: "Email updated successfully."});
    }
}

async function deleteUser(request, reply) {
  try {
    await UserInformation.query()
      .delete()
      .where("userId", request.params.id).throwIfNotFound();
      reply.status(204);
  } catch (error) {
    errorHandler(error, reply);
  }
}

export default {
  allUsers,
  userById,
  createUser,
  updateUser,
  updateCredentials,
  deleteUser
}