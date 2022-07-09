import Users from "../../../db/models/users.model.js";
import testHelpers from "../_test_helpers.js";

const chai = testHelpers.getChai();
const expect = chai.expect;

describe("::: POST /register :::", () => {
  it("Should return status 400 when invalid property name provided", async () => {
    const res = await chai.requester.post("/register").send({
      email: "valid@mail.com",
      passwd: "invalid key",
    });

    expect(res.statusCode).to.eql(400);
    expect(res.body.message).to.eql(
      "body must have required property 'password'"
    );
  });

  it("Should return status 400 when invalid email provided", async () => {
    const res = await chai.requester.post("/register").send({
      email: "invalid.com",
      password: "Random0Valid0!Password",
    });

    expect(res.statusCode).to.eql(400);
    expect(res.body.message).to.eql('body/email must match format "email"');
  });

  it("Should return status 400 when password does not meet requirements", async () => {
    const res = await chai.requester.post("/register").send({
      email: "validmail@mail.com",
      password: "pwddoesnotmeetrequirements",
    });

    expect(res.statusCode).to.eql(400);
    //TODO: Find out later if one can change the response message when AJV validation error happens on password validation. Is it good idea to reveal against what regex pattern the password string is compared. I guess not!?. Implicitly it seems to return back 'password does not meet requirements' followed by the actual regex pattern used.
    // console.log(res.body);
  });

  it("Should return status 201 and message that email verification has been sent", async () => {
    /**
     * Implementation does not within handler actually send verification email
     * How-to mock-up? For now, other logic of the implementation work.
     * */
    const res = await chai.requester.post("/register").send({
      email: "validmail@mail.com",
      password: "PassWord00_Valid",
    });

    expect(res.statusCode).to.eql(201);
    expect(res.body.message).to.eql(
      "Email verification for account has been sent"
    );

    // DB check for created user
    let createdUser = await Users.query()
      .where({ email: "validmail@mail.com" })
      .first();

    expect(createdUser.role).to.eql("user");
    expect(createdUser.email).to.eql("validmail@mail.com");
    expect(createdUser.emailStatus).to.eql("pending");
    expect(createdUser.password).to.not.eql("PassWord00_Valid");
  });
})