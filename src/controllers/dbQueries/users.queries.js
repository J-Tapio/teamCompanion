import Users from "../../../db/models/users.model.js";
import UserInformation from "../../../db/models/userInformation.model.js";

export default class UsersQueries {

  static async allUsers() {
    return await UserInformation.query()
      .joinRelated("users")
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
      )
      .throwIfNotFound();
  }

  static async userById({id}) {
    return await UserInformation.query()
      .joinRelated("users")
      .where("users.id", id)
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
      )
      .first()
      .throwIfNotFound();
  }

  static async createUser({userInformation}) {
    let {updatedAt,createdAt, ...newUser} = await UserInformation.query()
    .insert(userInformation);
    return newUser;
  }

  static async updateUser({updateInformation, user}) {
    let {createdAt, userId, ...updatedUser} = await UserInformation.query()
      .patch(updateInformation)
      .where("userId", user)
      .returning("*")
      .first()
      .throwIfNotFound();

    updatedUser.id = userId;
    return updatedUser;
  }

  static async updateCredentials({id, email, hashPassword}) {
    return await Users.query()
      .patch({
        email,
        ...(hashPassword && {password: hashPassword})
      })
      .where("id", id)
      .returning("*")
      .first()
      .throwIfNotFound();
  }

  static async deleteUser(id) {
    return await UserInformation.query()
      .delete()
      .where("userId", id)
      .throwIfNotFound();
  }
}
