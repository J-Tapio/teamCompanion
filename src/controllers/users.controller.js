import errorHandler from "../lib/errorHandler.js";
import fastify from "../../app.js";
import UsersQueries from "../controllers/dbQueries/users.queries.js";

async function allUsers(request, reply) {
  try {
    let data = await UsersQueries.allUsers();
    reply.send({count: data.length, data});
  } catch (error) {
    errorHandler(error,reply);
  }
}

async function userById(request, reply) {
  try {
    let user = await UsersQueries.userById({
      id: request.params.id || request.user.id
    });

    reply.send(user);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function createUser(request, reply) {
  try {
    let newUser = await UsersQueries.createUser({
      userInformation: request.body
    });
    reply.status(201).send(newUser);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateUser(request, reply) {
  try {
    let updatedUser = await UsersQueries.updateUser({
      updateInformation: request.body, 
      user: request.params.id || request.user.id
    });
    reply.send(updatedUser);
  } catch (error) {
    errorHandler(error, reply);
  }
}

async function updateCredentials(request, reply) {
  // Semantically more readable with 'var' as email is re-assigned.
    var {email, password} = request.body;
    let {id} = request.user;

    if(email && password) {
      const hashPassword = await fastify.bcrypt.hash(password);
      var {email} = await UsersQueries.updateCredentials({
        id, email, hashPassword
      });
      reply.send({email, message: "Email and Password successfully updated."});
    } else {
      var {email} = await UsersQueries.updateCredentials({
        id, email
      });
      reply.send({email, message: "Email updated successfully."});
    }
}

async function deleteUser(request, reply) {
  try {
    await UsersQueries.deleteUser(request.params.id);
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