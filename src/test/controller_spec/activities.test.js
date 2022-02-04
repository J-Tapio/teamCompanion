import TeamActivities from "../../../db/models/teamActivities.model.js";
import UserTeamActivities from "../../../db/models/userTeamActivities.model.js";
import testHelpers from "../_test_helpers.js";
const chai = testHelpers.getChai();
const { insertData } = testHelpers;
const expect = chai.expect;


//? POST, PUT - add also Db level check for inserted data(?)
// Participant POST/PUT contain dbChecks.


describe("::: ACTIVITIES CONTROLLER TESTS :::", () => {

    let adminUserToken;
    let coachUserToken;
    let trainerUserToken;
    let athleteUserToken;

    before(async () => {
      await insertData();

      adminUserToken = (
        await chai.requester
          .post("/login")
          .send({ email: "admin@mail.com", password: "admin123" })
      ).body.accessToken;
      
      coachUserToken = (
        await chai.requester
          .post("/login")
          .send({ email: "coach@mail.com", password: "coach123" })
      ).body.accessToken;

      trainerUserToken = (
        await chai.requester
          .post("/login")
          .send({ email: "trainer@mail.com", password: "trainer123" })
      ).body.accessToken;

      athleteUserToken = (
        await chai.requester
          .post("/login")
          .send({ email: "athlete@mail.com", password: "athlete123" })
      ).body.accessToken;
    });

    describe(":: With invalid / missing token / no priviledges ::", () => {

      it("Should return status 400 with invalid / missing token", async() => {
          let res1 = await chai.requester.get("/activities/team/1");
          let res2 = await chai.requester.get("/activities/team/1")
          .set("Authorization", "Bearer invalid");

          expect(res1.statusCode).to.eql(400);
          expect(res2.statusCode).to.eql(400);
      });

      it("Should return status 403 when no priviledges to resource", async() => {
          let res1 = await chai.requester.get("/activities/team/1")
            .set("Authorization", `Bearer ${athleteUserToken}`);

          let res2 = await chai.requester.get("/activities/team/2")
            .set("Authorization", `Bearer ${athleteUserToken}`);

          let res3 = await chai.requester
            .get("/activities/team/1/activity/6")
            .set("Authorization", `Bearer ${athleteUserToken}`);

          let res4 = await chai.requester
            .post("/activities/team/1")
            .send({
              activityTypeId: 2,
              venueId: 2,
              activityStart: "2022-02-02T20:00",
              activityEnd: "2022-02-02T20:00"
            })
            .set("Authorization", `Bearer ${athleteUserToken}`);

          let res5 = await chai.requester
            .put("/activities/team/1/activity/2")
            .send({activityTypeId: 3})
            .set("Authorization", `Bearer ${athleteUserToken}`);

          let res6 = await chai.requester
            .delete("/activities/team/1/activity/2")
            .set("Authorization", `Bearer ${athleteUserToken}`);

          let res7 = await chai.requester
            .post("/activities/team/1/activity/1/participants")
            .send({data: [{userTeamId: 2}]})
            .set("Authorization", `Bearer ${athleteUserToken}`);

          let res8 = await chai.requester
            .put("/activities/team/1/activity/1/participants")
            .send({ data: [{ userTeamId: 2 }] })
            .set("Authorization", `Bearer ${athleteUserToken}`);
          
          expect(res1.statusCode).to.eql(403);
          expect(res2.statusCode).to.eql(403);
          expect(res3.statusCode).to.eql(403);
          expect(res4.statusCode).to.eql(403);
          expect(res5.statusCode).to.eql(403);
          expect(res6.statusCode).to.eql(403);
          expect(res7.statusCode).to.eql(403);
          expect(res8.statusCode).to.eql(403);
        });
    });


    describe(":: With valid token & access priviledges ::", () => {

      describe(":: GET - /activities/team/:teamId ::", () => {
        it("Should return status 404 when unknown teamId", async () => {
          let res = await chai.requester
            .get("/activities/team/10")
            .set("Authorization", `Bearer ${adminUserToken}`);
          expect(res.statusCode).to.eql(404);
        });

        it("Should return all created activities", async () => {
          let res = await chai.requester
            .get("/activities/team/1")
            .set("Authorization", `Bearer ${coachUserToken}`);

          let data = res.body.data;
          expect(res.statusCode).to.eql(200);
          expect(data).to.have.all.keys("teamMatch", "teamPractise", "teamMeeting", "fitness", "rehabilitation");
          expect(data.teamMatch).to.be.ofSize(1);
          expect(data.teamPractise).to.be.ofSize(1);
          expect(data.teamMeeting).to.be.ofSize(1);
          expect(data.fitness).to.be.ofSize(2);
          expect(data.rehabilitation).to.be.ofSize(1);

          //! Puncture-like testing for some areas. Id related tests below will test more throughly fitness & teamMatch when activity by userTeamId being tested

          expect(data.rehabilitation[0]).to.have.all.keys("id", "activityTypeId","activityType", "activityStart", "activityEnd", "activityNotes","venue", "createdBy", "createdAt");

          expect(data.rehabilitation[0].id).to.eql(5);
          expect(data.rehabilitation[0].activityTypeId).to.eql(5);
          expect(data.rehabilitation[0].venue).to.include({
            venueId: 4,
            venueName: "Murcia FC Rehabilitation Clinic",
            streetAddress: "Stadion Street 1",
            zipCode: "12345",
            city: "Murcia",
            state: "Murcia",
            country: "Spain",
          });
          expect(data.rehabilitation[0].createdBy).to.include({
            userTeamId: 3,
            firstName: 'Physiotherapist',
            lastName: 'Physiotherapist',
            teamRole: 'Physiotherapist'
          });
        });

        it("Should return activities with participants when query provided", async()=> {
          let res = await chai.requester
            .get("/activities/team/1?participants=true")
            .set("Authorization", `Bearer ${coachUserToken}`);

          //console.log(res.body.data.teamMeeting[0].participants);
          let data = res.body.data;
          expect(res.statusCode).to.eql(200);
          expect(data).to.have.all.keys(
            "teamMatch",
            "teamPractise",
            "teamMeeting",
            "fitness",
            "rehabilitation"
          );

          //! Puncture-like testing for few areas
          //TODO: Add more tests if needed.
          let participants = data.teamMeeting[0].participants
          expect(participants.athletes).to.be.ofSize(0);
          delete participants.athletes;
          for(const participantRole in participants) {
            expect(participants[participantRole]).to.be.ofSize(1);
          }
          expect(participants.trainers[0]).to.include({
            userTeamId: 7,
            firstName: "Trainer",
            lastName: "Trainer",
            teamRole: "Trainer"
          })
        });
      });


      describe(":: GET - /activities/team/:teamId/member/:userTeamId ::", 
      () => {

        it("Should return status 404 when unknown userTeamId", async () => {
          let res = await chai.requester
            .get("/activities/team/1/member/10")
            .set("Authorization", `Bearer ${trainerUserToken}`);
          expect(res.statusCode).to.eql(404);
        });

        it("Should return activities by userTeamId", async() => {
          let res = await chai.requester
            .get("/activities/team/1/member/5")
            .set("Authorization", `Bearer ${coachUserToken}`);

          expect(res.statusCode).to.eql(200);
          expect(res.body).to.have.key("data");


          let data = res.body.data;

          expect(data).to.have.all.keys("teamMatch", "teamPractise", "teamMeeting", "fitness", "rehabilitation");
          expect(data.teamMeeting).to.be.ofSize(0);
          expect(data.fitness).to.be.ofSize(2);
          expect(data.teamMatch).to.be.ofSize(1);
          expect(data.rehabilitation).to.be.ofSize(1);
          expect(data.fitness).to.be.ofSize(2);
          expect(data.teamMatch[0]).to.have.all.keys(
            "id",
            "activityTypeId",
            "activityType",
            "activityStart",
            "activityEnd",
            "activityNotes",
            "participants",
            "opponent",
            "venue",
            "createdBy",
            "createdAt"
          );
          expect(data.teamMatch[0].id).to.eql(1);
          expect(data.teamMatch[0].activityTypeId).to.eql(1);
          expect(data.teamMatch[0].venue).to.include({
            venueId: 1,
            venueName: "Murcia FC Stadion",
            streetAddress: "Stadion Street 1",
            zipCode: "12345",
            city: "Murcia",
            state: "Murcia",
            country: "Spain",
          });
          expect(data.teamMatch[0].opponent).to.include({
            opponentName: "Barcelona FC",
            opponentLogo:
              "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbotw-pd.s3.amazonaws.com%2Fstyles%2Flogo-thumbnail%2Fs3%2F0012%2F1382%2Fbrand.gif%3Fitok%3D1zKENgus&f=1&nofb=1",
          });
          expect(data.teamMatch[0].participants.athletes).to.be.ofSize(1);
          expect(
            data.teamMatch[0].participants.athletes[0]
          ).to.include({
            userTeamId: 5,
            firstName: "Athlete",
            lastName: "Athlete",
            teamRole: "Athlete",
          });
          expect(data.teamMatch[0].createdBy).to.include({
            userTeamId: 6,
            firstName: 'Staff',
            lastName: 'Staff',
            teamRole: 'Staff'
          });

          //! Puncture-test like testing for some areas:
          expect(data.fitness[0].id).to.eql(2);
          expect(data.fitness[1].id).to.eql(3);
          expect(data.fitness[1].venue).to.include({
            venueId: 2,
            venueName: "Murcia FC TrainingCenter",
            streetAddress: "Stadion Street 1",
            zipCode: "12345",
            city: "Murcia",
            state: "Murcia",
            country: "Spain",
          });
          expect(data.fitness[0].activityType).to.eql("Fitness");
          expect(data.fitness[1].activityType).to.eql("Fitness");
          expect(data.fitness[0].activityStart).to.eql(
            "2022-02-15T17:00:00.000Z"
          );
          expect(data.fitness[1].activityStart).to.eql(
            "2022-02-16T09:00:00.000Z"
          );
          expect(data.fitness[0].participants.athletes).to.be.ofSize(1);
          expect(data.fitness[1].participants.athletes).to.be.ofSize(1);
          expect(data.fitness[0].participants.athletes[0]).to.include({
            userTeamId: 5,
            firstName: "Athlete",
            lastName: "Athlete",
            teamRole: "Athlete",
          });
          expect(data.fitness[1].participants.athletes[0]).to.include({
            userTeamId: 5,
            firstName: "Athlete",
            lastName: "Athlete",
            teamRole: "Athlete",
          });
        })
      });

      describe(":: GET - /activities/team/:teamId/activity/:activityId ::", () => {
        it("Should return status 404 when unknown activityId", async () => {
          let res = await chai.requester
            .get("/activities/team/1/activity/10")
            .set("Authorization", `Bearer ${trainerUserToken}`);
          expect(res.statusCode).to.eql(404);
        });

        it("Should return activity by activityId", async() => {
          let res = await chai.requester
            .get("/activities/team/1/activity/4")
            .set("Authorization", `Bearer ${coachUserToken}`);

          expect(res.statusCode).to.eql(200);
          expect(res.body.activityTypeId).to.eql(2);
          expect(res.body.activityType).to.eql("TeamPractise");
          expect(res.body.activityStart).to.eql("2022-02-17T19:00:00.000Z");
          expect(res.body.activityEnd).to.eql("2022-02-17T20:30:00.000Z");
          expect(res.body.activityNotes).to.be.null;
          expect(res.body.participants).to.have.all.keys("coaches", "trainers", "physiotherapists", "athletes", "staff");
          expect(res.body.participants.coaches).to.be.ofSize(0);
          expect(res.body.participants.physiotherapists).to.be.ofSize(0);
          expect(res.body.participants.staff).to.be.ofSize(0);
          expect(res.body.participants.trainers).to.be.ofSize(1);
          expect(res.body.participants.athletes).to.be.ofSize(1);
          expect(res.body.participants.trainers[0]).to.include({
            userTeamId: 2,
            firstName: "Trainer",
            lastName: "Trainer",
            teamRole: "Trainer",
          });
          expect(res.body.participants.athletes[0]).to.include({
            userTeamId: 5,
            firstName: "Athlete",
            lastName: "Athlete",
            teamRole: "Athlete",
          });
          expect(res.body.createdBy).to.include({
            userTeamId: 1,
            firstName: "Coach",
            lastName: "Coach",
            teamRole: "Coach",
          });
        });
      });

      describe(":: POST - /activities/team/:teamId ::", () => {
        it("Should return status 400 when providing invalid property", async () => {
          let res = await chai.requester
            .post("/activities/team/1")
            .send({
              activityTypeId: 2,
              venueId: 1,
              activityStart: "2022-01-29T18:00",
              activityEnd: "2022-01-29T19:30",
              invalidProperty: "Invalid",
            })
            .set("Authorization", `Bearer ${trainerUserToken}`);
          expect(res.statusCode).to.eql(400);
        });

        it("Should return status 400 when providing invalid value", async () => {
          let res = await chai.requester
            .post("/activities/team/1")
            .send({
              activityTypeId: 2,
              venueId: 1,
              activityStart: "2022-01-29",
              activityEnd: "2022-01-29",
            })
            .set("Authorization", `Bearer ${trainerUserToken}`);
          expect(res.statusCode).to.eql(400);
        });

        it("Should return status 400 when missing property", async () => {
          let res = await chai.requester
            .post("/activities/team/1")
            .send({
              venueId: 1,
              activityStart: "2022-02-10T19:00",
              activityEnd: "2022-02-10T20:00",
            })
            .set("Authorization", `Bearer ${trainerUserToken}`);
          expect(res.statusCode).to.eql(400);
        });

        it("Should return created activity", async () => {
          let res = await chai.requester
            .post("/activities/team/1")
            .send({
              activityTypeId: 4,
              venueId: 3,
              activityNotes: "Come prepared! No slacking!",
              activityStart: "2022-02-10T19:00",
              activityEnd: "2022-02-10T20:00",
            })
            .set("Authorization", `Bearer ${trainerUserToken}`);

          expect(res.statusCode).to.eql(201);
          expect(res.body.id).to.eql(7);
          expect(res.body.teamId).to.eql(1);
          expect(res.body.activityTypeId).to.eql(4);
          expect(res.body.venueId).to.eql(3);
          expect(res.body.activityNotes).to.eql("Come prepared! No slacking!");
          expect(res.body.opponentName).to.be.null;
          expect(res.body.opponentLogo).to.be.null;
        });

        it("Should return opponent information when teamMatch created", async () => {
          let res = await chai.requester
            .post("/activities/team/1")
            .send({
              activityTypeId: 1,
              venueId: 1,
              opponentName: "Football Team FC",
              activityNotes: "Team lunch 2 hours before match",
              activityStart: "2022-02-10T19:00",
              activityEnd: "2022-02-10T20:15",
            })
            .set("Authorization", `Bearer ${trainerUserToken}`);

          expect(res.statusCode).to.eql(201);
          expect(res.body.id).to.eql(8);
          expect(res.body.teamId).to.eql(1);
          expect(res.body.activityTypeId).to.eql(1);
          expect(res.body.venueId).to.eql(1);
          expect(res.body.activityNotes).to.eql(
            "Team lunch 2 hours before match"
          );
          expect(res.body.opponentName).to.eql("Football Team FC");
          expect(res.body.opponentLogo).to.be.null;
        });
      });

      describe(":: POST - /activities/team/:teamId/activity/:activityId/participants ::", () => {

        describe("Single participant insert to activity", () => {

          it("Should return status 404 when unknown userTeamId provided", 
          async() => {
            let res = await chai.requester
              .post("/activities/team/1/activity/1/participants")
              .send({data: [{
                userTeamId: 100,
              }]})
              .set("Authorization", `Bearer ${coachUserToken}`);
  
            expect(res.statusCode).to.eql(404);
          });
  
          it("Should return status 400 when invalid data provided", 
          async() => {
            let res1 = await chai.requester
              .post("/activities/team/1/activity/1/participants")
              .send({data: [{
                userTeamId: "invalid",
              }]})
              .set("Authorization", `Bearer ${coachUserToken}`);

            let res2 = await chai.requester
              .post("/activities/team/1/activity/1/participants")
              .send({data: [{
                userTeamId: "invalid",
              }]})
              .set("Authorization", `Bearer ${coachUserToken}`);
  
              expect(res1.statusCode).to.eql(400);
              expect(res2.statusCode).to.eql(400);
          })

          it("Should return status 400 when participant already part of the activity", 
          async() => {
            let res = await chai.requester
              .post("/activities/team/1/activity/1/participants")
              .send({data: [{
                userTeamId: 5,
              }]})
              .set("Authorization", `Bearer ${coachUserToken}`);
            expect(res.statusCode).to.eql(400);
          })

          it("Should add one participant to activity", 
          async() => {
            let res = await chai.requester
              .post("/activities/team/1/activity/1/participants")
              .send({data: [{
                userTeamId: 6,
              }]})
              .set("Authorization", `Bearer ${coachUserToken}`);

            expect(res.statusCode).to.eql(201);
          });
        });

        describe("Insert multiple participants to activity", () => {
          it("Should return status 400 when participant already in activity",
          async() => {
            let res = await chai.requester
              .post("/activities/team/1/activity/1/participants")
              .send({
                data: [{ userTeamId: 5 }, { userTeamId: 6 }],
              })
              .set("Authorization", `Bearer ${coachUserToken}`);
            expect(res.statusCode).to.eql(400);
          });

          it("Should return status 400 when providing invalid value",
          async() => {
            let res = await chai.requester
              .post("/activities/team/1/activity/6/participants")
              .send({
                data: [
                  { userTeamId: 5 },
                  { userTeamId: "string" },
                ],
              })
              .set("Authorization", `Bearer ${coachUserToken}`);
            expect(res.statusCode).to.eql(400);

            // Transaction should fail
            let dbCheck = await UserTeamActivities.query().where({
              userTeamId: 5,
              teamActivityId: 6,
            });
            expect(dbCheck).to.be.ofSize(0);
          });

          it("Should return status 404 when bulk insert fails by unknown id", 
          async() => {
            let res = await chai.requester
              .post("/activities/team/1/activity/6/participants")
              .send({data: [{ userTeamId: 5 }, { userTeamId: 100 }]})
              .set("Authorization", `Bearer ${coachUserToken}`);

            expect(res.statusCode).to.eql(404);

            // Transaction should fail
            let dbCheck = await UserTeamActivities.query().where({
              userTeamId: 5,
              teamActivityId: 6
            });
            expect(dbCheck).to.be.ofSize(0);
          });

  
          it("Should add multiple participants to activity", async() => {
            let res = await chai.requester
              .post("/activities/team/1/activity/4/participants")
              .send({
                data: [
                  {
                    userTeamId: 3,
                  },
                  {
                    userTeamId: 6,
                  },
                ],
              })
              .set("Authorization", `Bearer ${coachUserToken}`);
            expect(res.statusCode).to.eql(201);

            let dbCheck = await UserTeamActivities.query()
            .whereIn(["userTeamId", "teamActivityId"], [[3, 4], [6, 4]])
            expect(dbCheck).to.be.ofSize(2);
          });
        });
      });

      describe(":: PUT - /activities/team/:teamId/activity/:activityId ::", () => {
        it("Should return status 404 when unknown activityId", async () => {
          let res = await chai.requester
            .put("/activities/team/1/activity/100")
            .send({
              opponentName: "FootballTeam",
              activityNotes: "Team lunch 3 hours before match",
            })
            .set("Authorization", `Bearer ${trainerUserToken}`);
          expect(res.statusCode).to.eql(404);
        });

        it("Should return updated activity", async () => {
          let res = await chai.requester
            .put("/activities/team/1/activity/1")
            .send({
              opponentName: "FootballTeam",
              activityNotes: "Team lunch 3 hours before match",
              activityStart: "2022-02-13T19:00",
              activityEnd: "2022-02-10T20:30",
            })
            .set("Authorization", `Bearer ${coachUserToken}`);

          expect(res.statusCode).to.eql(200);
          expect(res.body.id).to.eql(1);
          expect(res.body.opponentName).to.eql("FootballTeam");
          expect(res.body.activityNotes).to.eql(
            "Team lunch 3 hours before match"
          );
          expect(res.body.updatedBy).to.eql(1);
          // Fails
          expect(res.body.activityStart).to.eql("2022-02-13T19:00:00.000Z");
          expect(res.body.activityEnd).to.eql("2022-02-10T20:30:00.000Z");
        });
      });

      describe(":: PUT - /activities/team/:teamId/activity/:activityId/participants ::", () => {

        describe("Remove single participant from activity", () => {

          it("Should return status 400 when providing invalid value",
          async() => {
            let res = await chai.requester
              .put("/activities/team/1/activity/1/participants")
              .send({data: [{
                userTeamId: "string",
              }]})
              .set("Authorization", `Bearer ${coachUserToken}`);
              expect(res.statusCode).to.eql(400);
            });

          it("Should return status 404 when provided with unknown id values", 
          async () => {
            let res = await chai.requester
              .put("/activities/team/1/activity/1/participants")
              .send({data: [{
                userTeamId: 10,
              }]})
              .set("Authorization", `Bearer ${coachUserToken}`);

            expect(res.statusCode).to.eql(404);
          });

          it("Should be able to remove participant from activity", 
          async () => {
            let res = await chai.requester
              .put("/activities/team/1/activity/1/participants")
              .send({data: [{
                userTeamId: 6,
              }]})
              .set("Authorization", `Bearer ${coachUserToken}`);

            expect(res.statusCode).to.eql(200);
          });
        });

        describe("Remove multiple participants from activity", () => {

          it("Transaction should fail when one invalid value type provided", async () => {
            let res = await chai.requester
              .put("/activities/team/1/activity/1/participants")
              .send({
                data: [
                  { userTeamId: 5 },
                  { userTeamId: "string" },
                ],
              })
              .set("Authorization", `Bearer ${coachUserToken}`);
            expect(res.statusCode).to.eql(400);

            // Transaction should have failed
            let dbCheck = await UserTeamActivities.query().where({
              userTeamId: 5,
              teamActivityId: 1,
            });
            expect(dbCheck).to.be.ofSize(1);
          });


          it("Transaction should fail by unknown id", async () => {
            let res = await chai.requester
              .put("/activities/team/1/activity/1/participants")
              .send({
                data: [ { userTeamId: 5 }, { userTeamId: 100 } ],
              })
              .set("Authorization", `Bearer ${coachUserToken}`);
            expect(res.statusCode).to.eql(404);

            // Transaction should fail
            let dbCheck = await UserTeamActivities.query().where({
              userTeamId: 5,
              teamActivityId: 1,
            });
            expect(dbCheck).to.be.ofSize(1);
          });

          it("Should remove multiple participants from activity", 
          async () => {
            let res = await chai.requester
              .put("/activities/team/1/activity/4/participants")
              .send({
                data: [ { userTeamId: 3 }, { userTeamId: 6 } ],
              })
              .set("Authorization", `Bearer ${coachUserToken}`)
          
            expect(res.statusCode).to.eql(200);

            let dbCheck = await UserTeamActivities.query()
              .whereIn(["userTeamId", "teamActivityId"], [[3, 4], [6, 4]])
              .returning("id")

            expect(dbCheck).to.be.ofSize(0);
          });
        });
      });

      describe(":: DELETE - /activities/team/:teamId/activity/:activityId ::", () => {
        it("Should return status 404 when unknown activityId", async () => {
          let res = await chai.requester
            .delete("/activities/team/1/activity/10")
            .set("Authorization", `Bearer ${trainerUserToken}`);
          expect(res.statusCode).to.eql(404);
        });

        it("Should delete activity by activityId", async () => {
          let res = await chai.requester
            .delete("/activities/team/1/activity/3")
            .set("Authorization", `Bearer ${trainerUserToken}`);

          expect(res.statusCode).to.eql(204);

          let dbCheck = await TeamActivities.query().select("id");
          expect(dbCheck.includes(3)).to.be.false;
        });
      });
    });

});
