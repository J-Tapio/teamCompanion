import testHelpers from "../_test_helpers.js";
const chai = testHelpers.getChai();
const {insertData} = testHelpers;
const expect = chai.expect;


describe("/login controller tests", () => {

  before(async () => {
    await insertData();
  });

  it("Should return status 401 with invalid credentials", async() => {
    const res1 = await chai.requester
      .post("/login")
      .send({ email: "invalid@mail.com", password: "admin123" });
    
    const res2 = await chai.requester
      .post("/login")
      .send({ email: "admin@mail.com", password: "invalidpwd" });

      expect(res1.statusCode).to.eql(400);
      expect(res1.body.message).to.eql("Invalid credentials.");
      expect(res2.statusCode).to.eql(400);
      expect(res2.body.message).to.eql("Invalid credentials.");
  });

  it("Should return accessToken when credentials are correct", async() => {
    const res = await chai.requester
      .post("/login")
      .send({ email: "admin@mail.com", password: "admin123" });

      expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.property("refreshToken");
  });
});