import LinkMembersTeams from "../../../db/models/teamMembers.model.js";
import UserTeams from "../../../db/models/userTeams.model.js";
import helperObject from "../helper_data/teams.helperdata.js";
import testHelpers from "../_test_helpers.js";
import * as fs from "fs";
const chai = testHelpers.getChai();
const { insertData } = testHelpers;
const expect = chai.expect;

describe("::: TEAMS CONTROLLER TESTS :::", () => {
  let adminUserToken;
  let coachUserToken;
  let athleteUserToken;
  let trainerUserToken;
  let staffUserToken;
  let physioUserToken;

  before(async () => {

    await insertData();

    adminUserToken = (
      await chai.requester
        .post("/login")
        .send({ email: "admin@mail.com", password: "admin123" })
    ).body.accessToken
    coachUserToken = (
      await chai.requester
        .post("/login")
        .send({ email: "coach@mail.com", password: "coach123" })
    ).body.accessToken
    athleteUserToken = (
      await chai.requester
        .post("/login")
        .send({ email: "athlete@mail.com", password: "athlete123" })
    ).body.accessToken
    staffUserToken = (
      await chai.requester
        .post("/login")
        .send({ email: "staff@mail.com", password: "staff123" })
    ).body.accessToken;
    trainerUserToken = (
      await chai.requester
        .post("/login")
        .send({ email: "trainer@mail.com", password: "trainer123" })
    ).body.accessToken;
    physioUserToken = (
      await chai.requester
        .post("/login")
        .send({ email: "physio@mail.com", password: "physio123" })
    ).body.accessToken;
  });


  describe("::With invalid / missing token / no priviledges to resource::", 
  () => {
    it("Should return status 400 without token in headers", async () => {
      const res = await chai.requester.get("/exercises");
      expect(res.statusCode).to.eql(400);
    });

    it("Should return status 400 when token is invalid", async () => {
      const res = await chai.requester
        .get("/exercises")
        .set("authorization", "Bearer invalid");
      expect(res.statusCode).to.eql(400);
    });

    it("Should return status 403 when user is not admin / coach / staff", async () => {
      const res1 = await chai.requester
        .get("/teams")
        .set("authorization", `Bearer ${athleteUserToken}`);
      const res2 = await chai.requester
        .get("/teams")
        .set("authorization", `Bearer ${coachUserToken}`);
      const res3 = await chai.requester
        .get("/teams")
        .set("authorization", `Bearer ${staffUserToken}`);
      const res4 = await chai.requester
        .get("/teams/2")
        .set("authorization", `Bearer ${athleteUserToken}`);

      expect(res1.statusCode).to.eql(403);
      expect(res2.statusCode).to.eql(403);
      expect(res3.statusCode).to.eql(403);
      expect(res4.statusCode).to.eql(403);
    });
  });

  describe("::: With valid access token & priviledges :::", 
  () => {

    describe("::: GET /teams :::", () => {
      it("Should return status 200 & teams", async () => {
        const res = await chai.requester
          .get("/teams")
          .set("authorization", `Bearer ${adminUserToken}`);

        expect(res.statusCode).to.eql(200);
        expect(res.body).to.have.all.keys("count", "data");
        expect(res.body.data).to.be.ofSize(2);
        expect(res.body.data[0]).to.have.all.keys(
          "id",
          "teamName",
          "streetAddress",
          "city",
          "zipCode",
          "state",
          "country",
        );
        expect(res.body.data[1]).to.have.all.keys(
          "id",
          "teamName",
          "streetAddress",
          "city",
          "zipCode",
          "state",
          "country",
        );
        expect(res.body.data[0].id).to.eql(1);
        expect(res.body.data[1].id).to.eql(2);
        expect(res.body.data[0].teamName).to.eql("Murcia FC");
        expect(res.body.data[1].teamName).to.eql("Barcelona FC");
        expect(res.body.data[0].city).to.eql("Murcia");
        expect(res.body.data[1].city).to.eql("Barcelona");
        expect(res.body.data[0].country).to.eql("Spain");
        expect(res.body.data[1].country).to.eql("Spain");
        expect(res.body.data[0].streetAddress).to.not.be.null;
        expect(res.body.data[0].zipCode).to.not.be.null;
        expect(res.body.data[0].state).to.not.be.null;
      });
    });

    describe("::: GET /teams/:id :::", () => {
      it("Should return 404 when team id unknown", async () => {
        const res = await chai.requester
          .get("/teams/10")
          .set("authorization", `Bearer ${adminUserToken}`);
        expect(res.statusCode).to.eql(404);
      });

      it("Should return team by known team id", async () => {
        const res = await chai.requester
          .get("/teams/1")
          .set("authorization", `Bearer ${adminUserToken}`);
        expect(res.statusCode).to.eql(200);
        expect(res.body.teamId).to.eql(1);
        expect(res.body.teamName).to.eql("Murcia FC");
        expect(res.body).to.have.all.keys(
          "teamId",
          "teamName",
          "teamAddress",
          "teamMembers"
        );
        expect(res.body.teamAddress).to.include({
          streetAddress: "Organisation Street 2, 10C",
          city: "Murcia",
          state: "Murcia",
          zipCode: "12345",
          country: "Spain",
        });
        expect(res.body.teamMembers).to.have.all.keys("coaches", "physiotherapists", "staff", "athletes", "trainers");
        expect(res.body.teamMembers.coaches[0]).to.include({
          userId: 2,
          firstName: "Coach",
          lastName: "Coach",
          teamRole: "Coach",
          status: "Active"
        });
        Object.values(res.body.teamMembers).forEach(
          (teamMemberRoles) => {
            expect(teamMemberRoles).to.be.ofSize(1);
            expect(teamMemberRoles[0]).to.have.all.keys(
              "userId",
              "firstName",
              "lastName",
              "teamRole",
              "status"
            );
            Object.values(teamMemberRoles).forEach((propertyValue) => {
              expect(propertyValue).to.not.be.null;
            })
          }
        )
      });
    });

    describe("::: POST /teams/register :::", () => {
      it("Should return status 400 when request body invalid", async() => {
        const res1 = await chai.requester
          .post("/teams/register")
          .send({
            teamName: "New Team",
            streetAddress: "Example Street 10C",
            city: "Helsinki",
            state: "Uusimaa",
            zipCode: "07820",
            country: "Finland",
            teamRole: "Staff",
            additionalProperty: "Totally invalid."
          })
          .set("authorization", `Bearer ${staffUserToken}`);

        const res2 = await chai.requester
          .post("/teams/register")
          .send({
            teamName: "New Team",
            streetAddress: "Example Street 10C",
            city: "Helsinki",
            state: "Uusimaa",
            zipCode: "07820",
            country: "Not part of enumerated values",
            teamRole: "Not part of enumerated values",
          })
          .set("authorization", `Bearer ${staffUserToken}`);

        const res3 = await chai.requester
          .post("/teams/register")
          .send({
            teamName: "New Team",
            streetAddress: "Example Street 10C",
            // Missing required properties
          })
          .set("authorization", `Bearer ${staffUserToken}`);

          expect(res1.statusCode).to.eql(400);
          expect(res2.statusCode).to.eql(400);
          expect(res3.statusCode).to.eql(400);
      });

      it("Should return status 201 & created team", async () => {
        const res = await chai.requester
          .post("/teams/register")
          .send({
            teamName: "New Team",
            streetAddress: "Example Street 10C",
            city: "Helsinki",
            state: "Uusimaa",
            zipCode: "07820",
            country: "Finland",
            teamRole: "Staff",
          })
          .set("authorization", `Bearer ${staffUserToken}`);

        expect(res.statusCode).to.eql(201);
        expect(res.body).to.have.all.keys(
          "id",
          "teamName",
          "streetAddress",
          "city",
          "state",
          "zipCode",
          "country",
          "createdAt"
        );
        expect(res.body.id).to.eql(3);
        expect(res.body.teamName).to.eql("New Team");
        expect(res.body.streetAddress).to.eql("Example Street 10C");
        expect(res.body.city).to.eql("Helsinki");
        expect(res.body.state).to.eql("Uusimaa");
        expect(res.body.zipCode).to.eql("07820");
        expect(res.body.country).to.eql("Finland");

        const dbJoinTableInformation = await UserTeams.query().where({
          userId: 6,
          teamId: 3
        }).first();
        expect(dbJoinTableInformation.id).to.eql(8);
        expect(dbJoinTableInformation.userId).to.eql(6);
        expect(dbJoinTableInformation.teamId).to.eql(3);
        expect(dbJoinTableInformation.teamRole).to.eql("Staff");
        expect(dbJoinTableInformation.status).to.eql("Active");

      });
    });

    describe("::: POST /teams/:id/team-logo/upload", () => {
      it("Should upload team logo image and return the url for image", 
      async() => {
        let workingDir = process.cwd();
        let csvPath =
          workingDir + "/src/test/helper_data/teamLogo.png";
        let res = await chai.requester
          .post("/teams/1/team-logo/upload")
          .set("Content-Type", "image/png")
          .attach("png", fs.readFileSync(csvPath), "teamLogo.png")
          .set("authorization", `Bearer ${staffUserToken}`);
      })
    })

    describe("::: GET /teams/me :::", () => {
      it("Should return status 400 when invalid/missing accessToken", async () => {
        const res = await chai.requester.get("/teams/me");
        expect(res.statusCode).to.eql(400);
      });

      it("Should return status 404, when user is not part of any team", async () => {
        const res = await chai.requester
          .get("/teams/me")
          .set("authorization", `Bearer ${adminUserToken}`);
        expect(res.statusCode).to.eql(404);
      });

      it("Should return status 200 & teams where user is member", async () => {
        const res1 = await chai.requester
          .get("/teams/me")
          .set("authorization", `Bearer ${athleteUserToken}`);
        expect(res1.statusCode).to.eql(200);
        expect(res1.body).to.haveOwnProperty("teams");
        expect(res1.body.teams).to.be.ofSize(1);
        expect(res1.body.teams[0]).to.have.all.keys(
          "teamId", 
          "teamName", 
          "teamRole",
          "userTeamId"
        );
        expect(res1.body.teams[0].teamId).to.eql(1);
        expect(res1.body.teams[0].teamName).to.eql("Murcia FC");
        expect(res1.body.teams[0].teamRole).to.eql("Athlete");
        expect(res1.body.teams[0].userTeamId).to.eql(5);

        const res2 = await chai.requester
          .get("/teams/me")
          .set("authorization", `Bearer ${physioUserToken}`);

        expect(res2.statusCode).to.eql(200);
        expect(res2.body).to.haveOwnProperty("teams");
        expect(res2.body.teams).to.be.ofSize(2);
        expect(res2.body.teams[0].teamId).to.eql(1);
        expect(res2.body.teams[0].teamName).to.eql("Murcia FC");
        expect(res2.body.teams[0].teamRole).to.eql("Physiotherapist");
        expect(res2.body.teams[0].userTeamId).to.eql(3);
        expect(res2.body.teams[1].teamId).to.eql(2);
        expect(res2.body.teams[1].teamName).to.eql("Barcelona FC");
        expect(res2.body.teams[1].teamRole).to.eql("Coach");
        expect(res2.body.teams[1].userTeamId).to.eql(4);
      });
    });



    describe("::: PUT /teams/:id :::", () => {
      it("Should return status 400 when request body invalid", async () => {
        const res = await chai.requester
          .put("/teams/1")
          .send({
            teamName: "Valid property and type",
            invalidProperty: "Should throw error.",
          })
          .set("authorization", `Bearer ${adminUserToken}`);

          expect(res.statusCode).to.eql(400);
      });

      it("Should return status 403 when request made by other than team coach / staff member",
        async () => {
          const res1 = await chai.requester
            .put("/teams/1")
            .send({
              teamName: "Should not be able to update",
            })
            .set("authorization", `Bearer ${athleteUserToken}`);
          
          const res2 = await chai.requester
            .put("/teams/3")
            .send({
              teamName: "Should not be able to update",
            })
            .set("authorization", `Bearer ${trainerUserToken}`);

          expect(res1.statusCode).to.eql(403);
          expect(res2.statusCode).to.eql(403);
          
        }
      );

      it("Should return updated team when updated by team staff member / admin",
        async () => {
          const res1 = await chai.requester
            .put("/teams/3")
            .send({
              teamName: "Staff member update",
            })
            .set("authorization", `Bearer ${staffUserToken}`);
          expect(res1.statusCode).to.eql(200);
          expect(res1.body).to.have.all.keys(
            "id",
            "teamName",
            "streetAddress",
            "city",
            "state",
            "zipCode",
            "country",
            "updatedAt"
          );
          expect(res1.body.teamName).to.eql("Staff member update");
          expect(res1.body.city).to.eql("Helsinki");
          expect(res1.body.country).to.eql("Finland");


          const res2 = await chai.requester
            .put("/teams/3")
            .send({
              teamName: "Admin Update",
              streetAddress: "Admin Street"
            })
            .set("authorization", `Bearer ${staffUserToken}`);
            expect(res2.statusCode).to.eql(200);
            expect(res2.body).to.have.all.keys(
              "id",
              "teamName",
              "streetAddress",
              "city",
              "state",
              "zipCode",
              "country",
              "updatedAt"
            );
            expect(res2.body.teamName).to.eql("Admin Update");
            expect(res2.body.streetAddress).to.eql("Admin Street");
            expect(res2.body.country).to.eql("Finland");
            expect(res2.body.state).to.eql("Uusimaa");

          //! Create coach link to the team via join-table of userTeams
          await UserTeams.query().insert({
            userId: 2,
            teamId: 3,
            teamRole: "Coach",
            status: "Active",
          });

          const res3 = await chai.requester
            .put("/teams/3")
            .send({
              teamName: "Coach Update",
              country: "Sweden",
            })
            .set("authorization", `Bearer ${coachUserToken}`);

            expect(res3.statusCode).to.eql(200);
            expect(res2.body).to.have.all.keys(
              "id",
              "teamName",
              "streetAddress",
              "city",
              "state",
              "zipCode",
              "country",
              "updatedAt"
            );
            expect(res3.body.teamName).to.eql("Coach Update");
            expect(res3.body.streetAddress).to.eql("Admin Street");
            expect(res3.body.state).to.eql("Uusimaa");
            expect(res3.body.country).to.eql("Sweden");
        }
      )
    });

    describe("::: DELETE /teams/:id :::",() => {
      it("Should return 404 when unknown team id", async () => {
        const res = await chai.requester
          .delete("/teams/10")
          .set("authorization", `Bearer ${adminUserToken}`);

        expect(res.statusCode).to.eql(404);
      });

      it("Should return 403 when request not made by the team creator / admin",
        async() => {
          const res1 = await chai.requester
            .delete("/teams/1")
            .set("authorization", `Bearer ${coachUserToken}`);

          const res2 = await chai.requester
            .delete("/teams/1")
            .set("authorization", `Bearer ${coachUserToken}`);

          const res3 = await chai.requester
            .delete("/teams/3")
            .set("authorization", `Bearer ${coachUserToken}`);
          
            expect(res1.statusCode).to.eql(403);
            expect(res2.statusCode).to.eql(403);
            expect(res3.statusCode).to.eql(403);
        }
      );

      it("Should return status 204 when team deleted successfully", 
      async () => {
        //TODO: Refactor later if team should be allowed to be deleted also by the coach if was created by staff member of team? I think resource(team) creator should be the only one besides admin to delete the resource.

        const res = await chai.requester
          .delete("/teams/3")
          .set("authorization", `Bearer ${staffUserToken}`);

        
        expect(res.statusCode).to.eql(204);
      });
    });

  /*   describe("::: GET /teams - EMPTY DATABASE :::", () => {
      it("Should return status 404 when database is empty", async() => {
        await Teams.query().del();
  
        let res = await chai.requester
          .get("/teams")
          .set("authorization", `Bearer ${adminUserToken}`);
        expect(res.statusCode).to.eql(404);
      })
    }) */
  });

  describe(":: POST /teams/:id/linked-members/create", () => {
    it("Should return 404 when unknown teamId", 
    async() => {
      let res = await chai.requester
        .post("/teams/100/linked-members/create")
        .send({
          data: [
            {
              email: "willfail@mail.com",
              teamRole: "Athlete",
            },
          ],
        })
        .set("authorization", `Bearer ${staffUserToken}`);
      expect(res.statusCode).to.eql(404);
    });
    
    it("Should return 400 when providing invalid data",
    async() => {
      let res1 = await chai.requester
        .post("/teams/1/linked-members/create")
        .send({
          data: [{
            email: "invalid.com",
          }]
        })
        .set("authorization", `Bearer ${staffUserToken}`);
      
        let res2 = await chai.requester
        .post("/teams/1/linked-members/create")
        .send({
          data: [{
            teamRole: "InvalidRole"
          }]
        })
        .set("authorization", `Bearer ${staffUserToken}`);

        let res3 = await chai.requester
        .post("/teams/1/linked-members/create")
        .send({
          data: [{
            email: "validmail@mail.com",
            teamRole: "InvalidRole"
          }]
        })
        .set("authorization", `Bearer ${staffUserToken}`);

        let res4 = await chai.requester
        .post("/teams/1/linked-members/create")
        .send({
          data: [{
            email: "invalidmail.com",
            teamRole: "Staff"
          }]
        })
        .set("authorization", `Bearer ${staffUserToken}`);

        expect(res1.statusCode).to.eql(400);
        expect(res2.statusCode).to.eql(400);
        expect(res3.statusCode).to.eql(400);
        expect(res4.statusCode).to.eql(400);
    });
    
    it("Should return created team member emails", async() => {
      let res = await chai.requester
        .post("/teams/1/linked-members/create")
        .send({
          data: [
            {
              email: "ili@tu.mk",
              teamRole: "Athlete",
            },
            {
              email: "cori@fibak.sj",
              teamRole: "Physiotherapist",
            },
            {
              email: "zaknu@cebbe.ie",
              teamRole: "Athlete",
            },
          ],
        })
        .set("authorization", `Bearer ${staffUserToken}`);
      
      expect(res.statusCode).to.eql(201);
      expect(res.body).to.have.key("data");
      let {data} = res.body;
      expect(data).to.be.ofSize(3);
      expect(data[0].id).to.eql(1);
      expect(data[0].teamRole).to.eql("Athlete");
      expect(data[0].email).to.eql("ili@tu.mk");
      expect(data[1].id).to.eql(2);
      expect(data[1].teamRole).to.eql("Physiotherapist");
      expect(data[1].email).to.eql("cori@fibak.sj");
      expect(data[2].id).to.eql(3);
      expect(data[2].teamRole).to.eql("Athlete");
      expect(data[2].email).to.eql("zaknu@cebbe.ie");
    })
  });


  describe(":: POST /teams/:id/linked-members/create/upload ::", () => {
    it("Should return 404 when unknown teamId", async() => {
      let workingDir = process.cwd();
      let csvPath =
        workingDir + "/src/test/helper_data/invalidTeamMembers.csv";
      let res = await chai.requester
        .post("/teams/100/linked-members/create/upload")
        .set("Content-Type", "text/csv")
        .attach("csv", fs.readFileSync(csvPath), "predefinedTeamMembers.csv")
        .set("authorization", `Bearer ${staffUserToken}`);
      expect(res.statusCode).to.eql(404);
    });

    /*
    One solution could be to use transaction
    
    it("Should return 400 when providing invalid data", async() => {
      let workingDir = process.cwd();
      let csvPath =
        workingDir + "/src/test/helper_data/invalidTeamMembers.csv";
      let res = await chai.requester
        .post("/teams/1/linked-members/create/upload")
        .set("Content-Type", "text/csv")
        .attach("csv", fs.readFileSync(csvPath), "invalidTeamMembers.csv")
        .set("authorization", `Bearer ${staffUserToken}`);

      expect(res.statusCode).to.eql(400);
    });
 */
    it("Should return created team members from CSV upload",
    async() => {
      let workingDir = process.cwd();
      let csvPath = workingDir + "/src/test/helper_data/predefinedTeamMembers.csv"
      let res = await chai.requester
        .post("/teams/1/linked-members/create/upload")
        .set("Content-Type", "text/csv")
        .attach("csv", fs.readFileSync(csvPath), "predefinedTeamMembers.csv")
        .set("authorization", `Bearer ${staffUserToken}`);

      expect(res.body).to.have.key("data");
      let {data} = res.body;

      expect(data[0].id).to.eql(4);
      expect(data[0].teamRole).to.eql("Athlete");
      expect(data[0].teamId).to.eql(1);

      expect(data[1].id).to.eql(5);
      expect(data[1].teamRole).to.eql("Athlete");
      expect(data[1].teamId).to.eql(1);

      expect(data[2].id).to.eql(6);
      expect(data[2].teamRole).to.eql("Athlete");
      expect(data[2].teamId).to.eql(1);
    });
  })


  describe(":: PUT /teams/:id/linked-members/:linkedMemberId", () => {
    it("Should return 404 when unknown teamId", async() => {
      let res = await chai.requester
        .put("/teams/100/linked-members/1")
        .send({
          teamRole: "Staff",
          email: "oops@fixed.com",
        })
        .set("authorization", `Bearer ${staffUserToken}`);
        expect(res.statusCode).to.eql(404);
    });

    it("Should return 400 when providing invalid data", async() => {
      let res1 = await chai.requester
        .put("/teams/1/linked-members/1")
        .send({
          email: "invalidmail.com",
        })
        .set("authorization", `Bearer ${staffUserToken}`);

      let res2 = await chai.requester
        .put("/teams/1/linked-members/1")
        .send({
          teamRole: "InvalidRole",
        })
        .set("authorization", `Bearer ${staffUserToken}`);

        expect(res1.statusCode).to.eql(400);
        expect(res2.statusCode).to.eql(400);
    });
    
    it("Should return updated team member info which is linked to the team",
    async() => {
      let res = await chai.requester
        .put("/teams/1/linked-members/1")
        .send({
          teamRole: "Staff",
          email: "oops@fixed.com",
        })
        .set("authorization", `Bearer ${staffUserToken}`);

      expect(res.statusCode).to.eql(200);
      let data = res.body.data;
      expect(data).to.have.all.keys(
        "id",
        "email",
        "teamRole",
        "teamId",
        "updatedAt"
      )
      expect(data.id).to.eql(1)
      expect(data.teamRole).to.eql("Staff")
      expect(data.email).to.eql("oops@fixed.com")
    });
  })


  describe(":: DELETE /teams/:id/linked-members/:linkedMemberId", () => {
    it("Should return 404 when unknown team", async() => {
      let res = await chai.requester
        .delete("/teams/100/linked-members/1")
        .set("authorization", `Bearer ${staffUserToken}`);
      expect(res.statusCode).to.eql(404);
    });

    it("Should return 404 when unknown id", async() => {
      let res = await chai.requester
        .delete("/teams/1/linked-members/100")
        .set("authorization", `Bearer ${staffUserToken}`);
      expect(res.statusCode).to.eql(404);
    });

    it("Should delete member to team link record", async() => {
      let res = await chai.requester
        .delete("/teams/1/linked-members/1")
        .set("authorization", `Bearer ${staffUserToken}`);
      
      expect(res.statusCode).to.eql(204);

      //DB CHECK:
      let dbResult = await LinkMembersTeams.query().select("id");
      expect(dbResult).to.be.ofSize(5);
      expect(dbResult.filter(id => id === 1)).to.be.ofSize(0);
    })
  })


  describe(":: GET /teams/:id/linked-members/pending",
  () => {
    it("Should return pending team member email activations",
    async() => {
      let res = await chai.requester
        .get("/teams/1/linked-members/pending")
        .set("authorization", `Bearer ${staffUserToken}`);
      expect(res.body.count).to.eql(5);
      expect(res.body.data).to.be.ofSize(5);
    });
  })


  describe(":: GET /teams/:id/venues ::", () => {
    it("Should return 404 when unknown teamId", async() => {
      let res = await chai.requester
        .get("/teams/100/venues")
        .set("authorization", `Bearer ${staffUserToken}`);
      expect(res.statusCode).to.eql(404);
    })
    it("Should return created venues by team", async() => {
      let res = await chai.requester
        .get("/teams/1/venues")
        .set("authorization", `Bearer ${staffUserToken}`);

      expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.keys("count", "data");
      res.body.data.forEach((venue, index) => {
        expect(venue).to.include(helperObject.allVenues[index])
      });
    })
  })


  describe(":: POST /teams/:id/venues ::", () => {
    it("Should return 404 when teamId unknown", async() => {
      let res = await chai.requester
        .post("/teams/100/venues")
        .send({
          venueName: "new venue",
          streetAddress: "NewVenue Street 10C",
          zipCode: "12345",
          city: "Murcia",
          state: "Murcia",
          country: "Spain",
        })
        .set("authorization", `Bearer ${staffUserToken}`);

      expect(res.statusCode).to.eql(404);
    });

    it("Should return 400 when invalid data provided", async() => {
      let res1 = await chai.requester
        .post("/teams/1/venues")
        .send({
          venueName: "new venue",
          streetAddress: "NewVenue Street 10C",
          zipCode: 12345, // Should be string
          city: "Murcia",
          country: "Spain",
        })
        .set("authorization", `Bearer ${staffUserToken}`);

      let res2 = await chai.requester
        .post("/teams/1/venues")
        .send({
          venueName: "new venue",
          streetAddress: "NewVenue Street 10C",
          zipCode: "12345",
          city: "Murcia",
          //country: "Spain", missing required property
        })
        .set("authorization", `Bearer ${staffUserToken}`);

        expect(res1.statusCode).to.eql(400);
        expect(res2.statusCode).to.eql(400);
    });

    it("Should return created team venue", async() => {
      let newVenue = {
        venueName: "New Venue",
        streetAddress: "NewVenue Street 10C",
        zipCode: "12345",
        city: "Murcia",
        state: "Murcia",
        country: "Spain",
      };

      let res = await chai.requester
        .post("/teams/1/venues")
        .send(newVenue)
        .set("authorization", `Bearer ${staffUserToken}`);

      expect(res.statusCode).to.eql(201);
      expect(res.body).to.have.all.keys(
        "id",
        "venueName",
        "streetAddress",
        "zipCode",
        "city",
        "country",
        "state",
        "teamId",
        "createdAt"
      )
      expect(res.body.id).to.eql(5);
      expect(res.body.teamId).to.eql(1);
      expect(res.body).to.include(newVenue);
    });
  })


  describe(":: PUT /teams/:id/venues/venue/:venueId ::", () => {
    it("Should return 404 when teamId unknown", async() => {
      let res = await chai.requester
        .put("/teams/100/venues/venue/1")
        .send({venueName: "Invalid"})
        .set("authorization", `Bearer ${staffUserToken}`);
      expect(res.statusCode).to.eql(404);
    });

    it("Should return 404 when venueId unknown", async() => {
      let res = await chai.requester
        .put("/teams/1/venues/venue/100")
        .send({ venueName: "Invalid Stadium" })
        .set("authorization", `Bearer ${staffUserToken}`);
      expect(res.statusCode).to.eql(404);
    });

    it("Should return 400 when invalid data provided", async() => {
      let res1 = await chai.requester
        .put("/teams/1/venues/venue/1")
        .send({ invalidProperty: "Should not pass" })
        .set("authorization", `Bearer ${staffUserToken}`);
      let res2 = await chai.requester
        .put("/teams/1/venues/venue/1")
        .send({ 
          venueName: "Murcia Stadion",
          city: 12345 // Should be string value
        })
        .set("authorization", `Bearer ${staffUserToken}`);
      expect(res1.statusCode).to.eql(400);
      expect(res2.statusCode).to.eql(400);
    });

    it("Should return updated team venue", async() => {
      let res = await chai.requester
        .put("/teams/1/venues/venue/1")
        .send({ 
          venueName: "Alicante Stadion",
          state: "Alicante"
        })
        .set("authorization", `Bearer ${staffUserToken}`);
      expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.all.keys(
        "id",
        "venueName",
        "streetAddress",
        "zipCode",
        "city",
        "state",
        "country",
        "teamId",
        "updatedAt"
      );
      expect(res.body.id).to.eql(1);
      expect(res.body.teamId).to.eql(1);
      expect(res.body.venueName).to.eql("Alicante Stadion");
      expect(res.body.state).to.eql("Alicante");
      expect(res.body.city).to.eql("Murcia");
    });
  })


  describe(":: DELETE /teams/:id/venues/venue/:venueId ::", () => {

    it("Should return 404 when unknown teamId", async() => {
      let res = await chai.requester
        .delete("/teams/100/venues/venue/1")
        .set("authorization", `Bearer ${staffUserToken}`);
      expect(res.statusCode).to.eql(404);
    });

    it("Should return 404 when venueId unknown", async() => {
      let res = await chai.requester
        .delete("/teams/1/venues/venue/100")
        .set("authorization", `Bearer ${staffUserToken}`);
      expect(res.statusCode).to.eql(404);
    });

    it("Should delete venue by id", async() => {
      let res = await chai.requester
        .delete("/teams/1/venues/venue/5")
        .set("authorization", `Bearer ${staffUserToken}`);
      expect(res.statusCode).to.eql(204);
    });
  })

});