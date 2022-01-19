import Users from "../../../db/models/users.model.js";
import testHelpers from "../_test_helpers.js";
import bcrypt from "bcryptjs";
const chai = testHelpers.getChai();
const {insertData} = testHelpers;
const expect = chai.expect;

// TODO: Add more expectations later. Figure out possible edge-cases.

describe("/users controller tests", () => {
  let adminUserToken;
  let coachUserToken;
  let athleteUserToken;

  before(async () => {
    await insertData();
    
    adminUserToken = (await chai.requester.post("/login").send({email: "admin@mail.com", password: "admin123"})).body.accessToken;
    
    coachUserToken = (await chai.requester.post("/login").send({email: "coach@mail.com", password: "coach123"})).body.accessToken;

    athleteUserToken = (await chai.requester.post("/login").send({email: "athlete@mail.com", password: "athlete123"})).body.accessToken;
  });


  describe("::With invalid/missing token or no admin priviledges::", () => {
    
    it("Should return status 400 without token in headers", async () => {
      const res = await chai.requester.get("/users");
      expect(res.statusCode).to.eql(400);
    });

    it("Should return status 400 when token is invalid", async () => {
      const res = await chai.requester.get("/users").set("authorization", "Bearer invalid");
      expect(res.statusCode).to.eql(400);
    });

    it("Should return status 403 when user does not have admin priviledges", async () => {
      const res = await chai.requester.get("/users").set("authorization", `Bearer ${coachUserToken}`);

      expect(res.statusCode).to.eql(403);
    });
  });

  describe("::With valid access token and Admin priviledges::", () => {

    describe(":: GET /users ::", () => {
      it("Should return all users with information about users", async () => {
        const res = await chai.requester
          .get("/users")
          .set("authorization", `Bearer ${adminUserToken}`);

        expect(res.statusCode).to.eql(200);
        expect(res.body.data).to.be.ofSize(5);
        expect(res.body.count).to.eql(5);
        // Add more expectations.
      });
    });

    describe(":: GET /users/profile ::", () => {
      it("Should return status 404 when user profile information not found", 
      async() => {
        let res = await chai.requester
          .get("/users/profile")
          .set("authorization", `Bearer ${adminUserToken}`);
        expect(res.statusCode).to.eql(404);
      });

      it("Should return status 200 & user's own information", async () => {
        let res = await chai.requester
          .get("/users/profile")
          .set("authorization", `Bearer ${athleteUserToken}`);

        expect(res.statusCode).to.eql(200);
        expect(res.body).to.have.all.keys(
          "id",
          "email",
          "firstName",
          "lastName",
          "dateOfBirth",
          "streetAddress",
          "city",
          "zipCode",
          "state",
          "country"
        );

        expect(res.body.id).to.eql(5);
        expect(res.body.email).to.eql("athlete@mail.com");
        expect(res.body.firstName).to.eql("Athlete");
        expect(res.body.lastName).to.eql("Athlete");
        expect(res.body.dateOfBirth).to.eql("1980-10-24");
        expect(res.body.streetAddress).to.eql("Example street 4, 40C");
        expect(res.body.city).to.eql("Murcia");
        expect(res.body.state).to.eql("Murcia");
        expect(res.body.country).to.eql("Spain");
        expect(res.body).to.not.have.property("createdAt");
        expect(res.body).to.not.have.property("updatedAt");
      })
    });

    describe(":: PUT /users/profile ::", () => {
      it("Should return status 400 when invalid properties / values provided", async () => {
        let res = await chai.requester
          .put("/users/profile")
          .send({
            firstName: "Valid",
            lastName: 30,
            invalidProperty: "Invalid",
          })
          .set("authorization", `Bearer ${athleteUserToken}`);
        expect(res.statusCode).to.eql(400);
      });

      it("Should return status 200 & updated information", async() => {
        let res = await chai.requester
          .put("/users/profile")
          .send({
            firstName: "Usain",
            lastName: "Bolt",
            city: "Helsinki",
            country: "Jamaica",
            dateOfBirth: "1980-11-14"
          })
          .set("authorization", `Bearer ${athleteUserToken}`);

        //console.log(res.body);

        expect(res.statusCode).to.eql(200);
        expect(res.body).to.have.all.keys(
          "id",
          "firstName",
          "lastName",
          "dateOfBirth",
          "streetAddress",
          "city",
          "zipCode",
          "state",
          "country",
          "updatedAt"
        );
        expect(res.body.id).to.eql(5);
        expect(res.body.firstName).to.eql("Usain");
        expect(res.body.lastName).to.eql("Bolt");
        expect(res.body.dateOfBirth).to.eql("1980-11-14");
        expect(res.body.streetAddress).to.eql("Example street 4, 40C");
        expect(res.body.city).to.eql("Helsinki");
        expect(res.body.state).to.eql("Murcia");
        expect(res.body.country).to.eql("Jamaica");
      })
    });

    describe(":: PUT /users/profile/credentials ::", () => {
      it("Should update email", async() => {
        let res = await chai.requester
          .put("/users/profile/credentials")
          .send({email: "emailedited@mail.com"})
          .set("Authorization", `Bearer ${athleteUserToken}`);

        expect(res.statusCode).to.eql(200);
        expect(res.body).to.have.all.keys("email", "message");
        expect(res.body.email).to.eql("emailedited@mail.com");
        expect(res.body.message).to.eql("Email updated successfully.");

        let {email} = await Users.query()
        .select("email").where("id", 5).first();
        expect(email).to.eql("emailedited@mail.com");

      });

      it("Should update email & password", async() => {
        let res = await chai.requester
          .put("/users/profile/credentials")
          .send({
            email: "editedagain@mail.com",
            password: "newPassword123"
          })
          .set("Authorization", `Bearer ${athleteUserToken}`);
        
        expect(res.statusCode).to.eql(200);
        expect(res.body).to.have.all.keys("email", "message");
        expect(res.body.email).to.eql("editedagain@mail.com");
        expect(res.body.message).to.eql("Email and Password successfully updated.");

        const {email, password} = await Users.query().select("email", "password").where("id", 5).first();

        expect(email).to.eql("editedagain@mail.com")
        const passwordMatch = bcrypt.compareSync("newPassword123", password)
        expect(passwordMatch).to.be.true;

      });
    })

    describe(":: GET /users/:id ::", () => {
      it("Should return 404 when user not found by unknown id", async () => {
        const res = await chai.requester
          .get("/users/10")
          .set("authorization", `Bearer ${adminUserToken}`);
        expect(res.statusCode).to.eql(404);
      });

      it("Should return user by id", async () => {
        const res1 = await chai.requester.get("/users/2").set("authorization", `Bearer ${adminUserToken}`);
        
        // COACH
        expect(res1.statusCode).to.eql(200);
        expect(res1.body.id).to.eql(2);
        expect(res1.body.email).to.eql("coach@mail.com");
        expect(res1.body.firstName).to.eql("Coach");
        expect(res1.body.lastName).to.eql("Coach");
        expect(res1.body.dateOfBirth).to.eql("1980-10-21");
        expect(res1.body.streetAddress).to.eql("Example street 1, 10C");
        expect(res1.body.city).to.eql("Murcia");
        expect(res1.body.state).to.eql("Murcia");
        expect(res1.body.country).to.eql("Spain");
        expect(res1.body).to.not.have.property("createdAt");
        expect(res1.body).to.not.have.property("updatedAt");
      });
    });


    describe(":: POST /users ::", () => {
      it("Should be able to create a new user", async () => {
        const res = await chai.requester.post("/users").send({
          firstName: "New",
          lastName: "User",
          dateOfBirth: "1980-11-11",
          streetAddress: "Example Street 10, 50C",
          city: "Helsinki",
          state: "Uusimaa",
          zipCode: "07820",
          country: "Finland",
        }).set("authorization", `Bearer ${adminUserToken}`);
        
        expect(res.statusCode).to.eql(201);
        expect(res.body.firstName).to.eql("New");
        expect(res.body.lastName).to.eql("User");
        expect(res.body.dateOfBirth).to.eql("1980-11-11");
        expect(res.body.state).to.eql("Uusimaa");
      });
    });

    describe(":: PUT /users/:id ::", () => {
      it("Should return 404 when updating user with unknown id", async () => {
        const res = await chai.requester
          .delete("/users/10")
          .set("authorization", `Bearer ${adminUserToken}`);;
        expect(res.statusCode).to.eql(404);
      });
  
      it("Should be able to update user", async () => {
        const res = await chai.requester
          .put("/users/2")
          .send({
            firstName: "Head",
            lastName: "Coach",
            dateOfBirth: "1980-11-11",
            streetAddress: "Example Street 10, 50C",
          })
          .set("authorization", `Bearer ${adminUserToken}`);;
        expect(res.statusCode).to.eql(200);
      });
    });

    describe(":: DELETE /users/:id ::", () => {
      it("Should return 404 when deleting user with unknown id", async () => {
        const res = await chai.requester
          .delete("/users/10")
          .set("authorization", `Bearer ${adminUserToken}`);;
        expect(res.statusCode).to.eql(404);
      });
  
      it("Should be able to delete user", async () => {
        const res = await chai.requester
          .delete("/users/6")
          .set("authorization", `Bearer ${adminUserToken}`);;
        expect(res.statusCode).to.eql(204);
      });
    });

  });
});
