/**
 * Instead of running register function and implementing email send,
 * 
 *  */
import Users from "../../../db/models/users.model.js";
import testHelpers from "../_test_helpers.js";

const chai = testHelpers.getChai();
const expect = chai.expect;

describe("::: POST /register :::", () => {

  it("Should return status 400 when invalid property provided", 
  async() => {
    const res = await chai.requester.post("/register")
    .send({
      email: "valid@mail.com",
      passwd: "invalid key"
    });

    expect(res.statusCode).to.eql(400);
    expect(res.body.message).to.eql(
      "body should have required property 'password'"
    );
  });

  it("Should return status 400 when invalid email provided", 
  async() => {
    const res = await chai.requester.post("/register")
    .send({
      email: "invalid.com",
      password: "Random0Valid0!Password"
    });

    expect(res.statusCode).to.eql(400);
    expect(res.body.message).to.eql('body.email should match format "email"');
  });

  it("Should return status 400 when password does not meet requirements",
  async() => {
    const res = await chai.requester.post("/register").send({
      email: "validmail@mail.com",
      password: "pwddoesnotmeetrequirements",
    });

    expect(res.statusCode).to.eql(400);
    //TODO: Find out later if one can change the response message when AJV validation error happens on password. Is it good idea to reveal against what regex pattern the password string is compared. I guess not!?. Implicitly it seems to return back that password does not meet requirements followed by the actual regex pattern used.
  });

  it("Should return status 201 and message that email verification has been sent",
    async() => {
      const res = await chai.requester.post("/register").send({
        email: "validmail@mail.com",
        password: "PassWord00_Valid",
      });

      console.log(res.body.message)
      expect(res.statusCode).to.eql(201);
      expect(res.body.message).to.eql("Email verification for account has been sent")

      // DB check for created user:
      let createdUser = await Users.query().where({email: "validmail@mail.com"}).first()
      console.log(createdUser);

      expect(createdUser.role).to.eql("user");
      expect(createdUser.email).to.eql("validmail@mail.com");
      expect(createdUser.emailStatus).to.eql("pending");
      expect(createdUser.password).to.not.eql("PassWord00_Valid");

    }
  )
})