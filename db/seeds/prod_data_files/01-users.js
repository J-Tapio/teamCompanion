import bcrypt from "bcryptjs";

export const seed = function (knex) {
  const adminPwdHash = bcrypt.hashSync("SkelerSkeler123", 14);

  return knex("users").insert([
    {
      id: 1,
      email: "juhatapio.turpeinen@gmail.com",
      password: adminPwdHash,
      role: "admin",
    }
  ]);  
};
