import User from "../../db/models/users.model.js";

async function registerUser(request, reply) {
  try {
    console.log(request.body);
    //const newUser = await User.query().insert(request.body);
    reply.send({message: "hello"})
  } catch (error) {
    console.log(error);
  }
}

export default registerUser;
