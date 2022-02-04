import ExerciseSets from "../../../db/models/exerciseSets.model.js";
import UserInformation from "../../../db/models/userInformation.model.js";
import Users from "../../../db/models/users.model.js";
import UserTeamActivities from "../../../db/models/userTeamActivities.model.js";
import UserTeams from "../../../db/models/userTeams.model.js";
import testHelpers from "../_test_helpers.js";
import helperObjects from "../helper_data/activities.helperdata.js";
const chai = testHelpers.getChai();
const { insertData } = testHelpers;
const expect = chai.expect;


async function addNewAthlete() {
  let newAthleteInformation = {
    usersTable: {
      email: "athlete2@mail.com",
      password: "$2a$14$AEKqIPCcQRYWuK9WneDW7eROZ.Erm35c65TnSiC.Z8Ta2CBabImXi",
    },
    userInformation: {
      firstName: "Athlete2",
      lastName: "Athlete2",
      dateOfBirth: "1980-10-21",
      streetAddress: "Example street 1, 10C",
      city: "Murcia",
      state: "Murcia",
      zipCode: "12345",
      country: "Spain",
    },
    userTeams: {
      teamId: 1,
      teamRole: "Athlete",
      status: "Active",
    },
  };

  let newAthleteExerciseSets = [
    {
      userTeamActivitiesId: 15,
      exercisesEquipmentId: 1,
      assignedExWeight: null,
      assignedExRepetitions: null,
      assignedExDuration: 30,
      assignedExDistance: 4000,
    },
    {
      userTeamActivitiesId: 15,
      exercisesEquipmentId: 3,
      assignedExWeight: 90,
      assignedExRepetitions: 10,
      assignedExDuration: null,
      assignedExDistance: null,
      assignedExVariation: "Sumo",
    },
  ];

  var {id} = await Users.query()
    .insert(newAthleteInformation.usersTable)
    .returning("*");
  
  await UserInformation.query()
    .insert({userId: id, ...newAthleteInformation.userInformation})
  
  var {id} = await UserTeams.query()
    .insert({
      userId: id, 
      ...newAthleteInformation.userTeams
    })
    .returning("*")

  await UserTeamActivities.query()
    .insert({
      userTeamId: id,
      teamActivityId: 2,
    })
  //! ExerciseSets table id's start from id 17 after this.
  await ExerciseSets.query().insert(newAthleteExerciseSets);
}


describe.only("::: ACTIVITIES / FITNESS CONTROLLER TESTS :::", () => {

    let adminUserToken;
    let coachUserToken;
    let trainerUserToken;
    let athleteUserToken1;
    let athleteUserToken2;

    before(async() => {
      await insertData();
      await addNewAthlete();

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

      athleteUserToken1 = (
        await chai.requester
          .post("/login")
          .send({ email: "athlete@mail.com", password: "athlete123" })
      ).body.accessToken;

      athleteUserToken2 = (
        await chai.requester
          .post("/login")
          .send({ email: "athlete2@mail.com", password: "athlete456" })
      ).body.accessToken;
    });


    describe(":: With invalid / missing token / no priviledges ::", () => {

      it("Should return status 400 with invalid / missing token", 
      async () => {
          let res1 = await chai.requester.get("/activities/team/1/activity/fitness")

          let res2 = await chai.requester
          .get("/activities/team/1/activity/fitness/3")
          .set("Authorization", `Bearer invalid`)

          let res3 = await chai.requester.get(
            "/activities/team/1/activity/fitness/member/5"
          )

          let res4 = await chai.requester.get(
            "/activities/team/1/activity/2/fitness/member/5/exercises"
          ).set("Authorization", "Bearer ")

          let res5 = await chai.requester
            .post("/activities/team/1/activity/fitness/2")
            .send({
              data: [{
                  userTeamActivitiesId: 2,
                  exercisesEquipmentId: 3,
              }]
            });

          let res6 = await chai.requester
            .put("/activities/team/1/activity/fitness/2")
            .send({data: [{
                userTeamActivitiesId: 3,
                  exercisesEquipmentId: 4,
                }]
            });


          expect(res1.statusCode).to.eql(400);
          expect(res2.statusCode).to.eql(400);
          expect(res3.statusCode).to.eql(400);
          expect(res4.statusCode).to.eql(400);
          expect(res5.statusCode).to.eql(400);
          expect(res6.statusCode).to.eql(400);
      });

      it("Should return status 403 when no priviledges to resource", 
      async() => {

          let res1 = await chai.requester
            .get("/activities/team/1/activity/fitness")
            .set("Authorization", `Bearer ${athleteUserToken1}`);

          let res2 = await chai.requester
            .post("/activities/team/1/activity/fitness/3")
            .send({
              data: [helperObjects.validPostData[0]],
            })
            .set("Authorization", `Bearer ${athleteUserToken2}`);

          let res3 = await chai.requester
            .put("/activities/team/1/activity/fitness/2")
            .send({data:[{
              userTeamActivitiesId: 3,
              exercisesEquipmentId: 4,
            }]})
            .set("Authorization", `Bearer ${athleteUserToken1}`);

          // Requesting team member part of activity but request
          // contains wrong userTeamId - not the same as request user has!

          let res4 = await chai.requester
            .get("/activities/team/1/activity/2/fitness/member/5/exercises")
            .set("Authorization", `Bearer ${athleteUserToken2}`);

          let res5 = await chai.requester
            .get("/activities/team/1/activity/fitness/member/8")
            .set("Authorization", `Bearer ${athleteUserToken1}`);

          expect(res1.statusCode).to.eql(403);
          expect(res2.statusCode).to.eql(403);
          expect(res3.statusCode).to.eql(403);
          expect(res4.statusCode).to.eql(403);
          expect(res5.statusCode).to.eql(403);
      });
    });

    describe(":: With valid access token & priviledge ::", () => {
      describe(":: GET /activities/team/:teamId/activity/fitness ::", 
      () => {
      
        it("Should return status 404 when unknown teamId", async() => {
          let res = await chai.requester
            .get("/activities/team/100/activity/fitness")
            .set("Authorization", `Bearer ${coachUserToken}`)

          expect(res.statusCode).to.eql(404);
        })

        it("Should retrieve all assigned fitness activities of team", 
        async () => {

          let res = await chai.requester
            .get("/activities/team/1/activity/fitness")
            .set("Authorization", `Bearer ${trainerUserToken}`);

          let {data} = res.body;

          expect(res.statusCode).to.eql(200);
          expect(data).to.be.ofSize(2);
          //! ATHLETE 1:
          expect({
            userTeamId: data[0].teamMember.userTeamId, 
            firstName: data[0].teamMember.firstName, 
            lastName: data[0].teamMember.lastName, 
            teamRole: data[0].teamMember.teamRole
          }).to.eql(helperObjects.allFitnessActivities.teamMember1.userInfo);

          // Evaluate each activity
          let resAthlete1FitnessActivities = data[0].fitnessActivities;
          let athlete1FitnessActivities = helperObjects.allFitnessActivities.teamMember1.fitnessActivities;

          for(let i=0; i < resAthlete1FitnessActivities; i++) {
            expect(resAthlete1FitnessActivities[i].userTeamActivitiesId).to.eql(
              athlete1FitnessActivities[i].userTeamActivitiesId
            )
            expect(resAthlete1FitnessActivities[i].rpeValue).to.eql(
              athlete1FitnessActivities[i].rpeValue
            )

            resAthlete1FitnessActivities[i].exercises.forEach((resExercise, ii) => {
              let athlete1Exercise =
                athlete1FitnessActivities[i].exercises[ii];

              expect(resExercise.exercisesEquipmentId).to.eql(
                athlete1Exercise.exercisesEquipmentId
              )
              expect(resExercise.exerciseName).to.eql(
                athlete1Exercise.exerciseName
              );
              expect(resExercise.equipmentName).to.eql(
                athlete1Exercise.equipmentName
              )
              expect(resExercise.exerciseSetsAmount).to.eql(
                athlete1Exercise.exerciseSetsAmount
              )

              resExercise.exerciseSets.forEach((resExerciseSet, iii) => {
                let athlete1ExerciseSet = athlete1FitnessActivities[i].exercises[ii].exerciseSets[iii]

                expect(resExerciseSet).to.deep.equal(athlete1ExerciseSet)
              })
            })
          }

          //! ATHLETE 2:
          expect({
            userTeamId: data[1].teamMember.userTeamId,
            firstName: data[1].teamMember.firstName,
            lastName: data[1].teamMember.lastName,
            teamRole: data[1].teamMember.teamRole,
          }).to.eql(helperObjects.allFitnessActivities.teamMember2.userInfo);
          // Evaluate each activity
          let resFitnessActivities2 = data[1].fitnessActivities;
          let athlete2FitnessActivities =
            helperObjects.allFitnessActivities.teamMember2.fitnessActivities;

          for (let i = 0; i < resFitnessActivities2; i++) {
            expect(resFitnessActivities2[i].userTeamActivitiesId).to.eql(
              athlete2FitnessActivities[i].userTeamActivitiesId
            );
            expect(resFitnessActivities2[i].rpeValue).to.eql(
              athlete2FitnessActivities[i].rpeValue
            );

            resFitnessActivities2[i].exercises.forEach((resExercise, ii) => {
              let athlete2Exercise =
                athlete2FitnessActivities[i].exercises[ii];
              expect(resExercise.exercisesEquipmentId).to.eql(
                athlete2Exercise.exercisesEquipmentId
              );
              expect(resExercise.exerciseName).to.eql(
                athlete2Exercise.exerciseName
              );
              expect(resExercise.equipmentName).to.eql(
                athlete2Exercise.equipmentName
              );
              expect(resExercise.exerciseSetsAmount).to.eql(
                athlete2Exercise.exerciseSetsAmount
              );

              resExercise.exerciseSets.forEach((resExerciseSet, iii) => {
                let athlete2ExerciseSet =
                  athlete1FitnessActivities[i].exercises[ii].exerciseSets[iii];

                expect(resExerciseSet).to.deep.equal(athlete2ExerciseSet);
              });
            });
          }
        });
      });


      describe(
      ":: GET /activities/team/:teamId/activity/fitness/:activityId ::", 
      () => {
        it("Should return status 404 when unknown teamId or activityId",
        async() => {
          let res1 = await chai.requester
            .get("/activities/team/100/activity/fitness/2")
            .set("Authorization", `Bearer ${coachUserToken}`);
        
          let res2 = await chai.requester
            .get("/activities/team/1/activity/fitness/100")
            .set("Authorization", `Bearer ${coachUserToken}`);
        
          expect(res1.statusCode).to.eql(404)
          expect(res2.statusCode).to.eql(404)
        });
      
        it("Should return participant(s) with assigned exercises of fitness activity", 
        async() => {
          let res = await chai.requester
            .get("/activities/team/1/activity/fitness/2")
            .set("Authorization", `Bearer ${coachUserToken}`);
        
          expect(res.statusCode).to.eql(200);
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.be.ofSize(2);
          expect(res.body.data[0].fitnessActivities).to.be.ofSize(1);
        
          let { data } = res.body;
        
          //Athlete 1:
          expect({
            userTeamId: data[0].teamMember.userTeamId,
            firstName: data[0].teamMember.firstName,
            lastName: data[0].teamMember.lastName,
            teamRole: data[0].teamMember.teamRole,
          }).to.eql(helperObjects.allFitnessActivities.teamMember1.userInfo);
        
          // Evaluate each activity
          let resAthlete1FitnessActivities = data[0].fitnessActivities;
          let athlete1FitnessActivities =
            helperObjects.allFitnessActivities.teamMember1.fitnessActivities;
          for (let i = 0; i < resAthlete1FitnessActivities; i++) {
            expect(
              resAthlete1FitnessActivities[i].userTeamActivitiesId
            ).to.eql(athlete1FitnessActivities[i].userTeamActivitiesId);
            expect(resAthlete1FitnessActivities[i].rpeValue).to.eql(
              athlete1FitnessActivities[i].rpeValue
            );
            
              resAthlete1FitnessActivities[i].exercises.forEach(
                (resExercise, ii) => {
                  let athlete1Exercise =
                    athlete1FitnessActivities[i].exercises[ii];

                  expect(resExercise.exercisesEquipmentId).to.eql(
                    athlete1Exercise.exercisesEquipmentId
                  );
                  expect(resExercise.exerciseName).to.eql(
                    athlete1Exercise.exerciseName
                  );
                  expect(resExercise.equipmentName).to.eql(
                    athlete1Exercise.equipmentName
                  );
                  expect(resExercise.exerciseSetsAmount).to.eql(
                    athlete1Exercise.exerciseSetsAmount
                  );

                  resExercise.exerciseSets.forEach((resExerciseSet, iii) => {
                    let athlete1ExerciseSet =
                      athlete1FitnessActivities[i].exercises[ii].exerciseSets[
                        iii
                      ];

                    expect(resExerciseSet).to.deep.equal(athlete1ExerciseSet);
                  });
                }
              );
            }

            // Athlete2:
            expect({
              userTeamId: data[1].teamMember.userTeamId,
              firstName: data[1].teamMember.firstName,
              lastName: data[1].teamMember.lastName,
              teamRole: data[1].teamMember.teamRole,
            }).to.eql(helperObjects.allFitnessActivities.teamMember2.userInfo);
            expect(data[1].fitnessActivities).to.be.ofSize(1);

            // Evaluate activity
            let resFitnessActivities2 = data[1].fitnessActivities;
            let athlete2FitnessActivities =
              helperObjects.allFitnessActivities.teamMember2.fitnessActivities;

            for (let i = 0; i < resFitnessActivities2; i++) {
              expect(resFitnessActivities2[i].userTeamActivitiesId).to.eql(
                athlete2FitnessActivities[i].userTeamActivitiesId
              );
              expect(resFitnessActivities2[i].rpeValue).to.eql(
                athlete2FitnessActivities[i].rpeValue
              );

              resFitnessActivities2[i].exercises.forEach((resExercise, ii) => {
                let athlete2Exercise =
                  athlete2FitnessActivities[i].exercises[ii];
                expect(resExercise.exercisesEquipmentId).to.eql(
                  athlete2Exercise.exercisesEquipmentId
                );
                expect(resExercise.exerciseName).to.eql(
                  athlete2Exercise.exerciseName
                );
                expect(resExercise.equipmentName).to.eql(
                  athlete2Exercise.equipmentName
                );
                expect(resExercise.exerciseSetsAmount).to.eql(
                  athlete2Exercise.exerciseSetsAmount
                );

                resExercise.exerciseSets.forEach((resExerciseSet, iii) => {
                  let athlete2ExerciseSet =
                    athlete1FitnessActivities[i].exercises[ii].exerciseSets[
                      iii
                    ];

                  expect(resExerciseSet).to.deep.equal(athlete2ExerciseSet);
                });
              });
            }

            //Test against fitness activity where only one participant:
            let res3  = await chai.requester
            .get("/activities/team/1/activity/fitness/3")
            .set("Authorization", `Bearer ${coachUserToken}`);
            
            expect(res3.body.data).to.be.ofSize(1);
            expect(res3.body.data[0].teamMember.userTeamId).to.eql(5);
            expect(res3.body.data[0].fitnessActivities).to.be.ofSize(1);
            expect(res3.body.data[0].fitnessActivities[0].userTeamActivitiesId).to.eql(3);
            /**
             * Exercises have already been evaluated within tests for all
             * fitness activities
             */
          });
        });

      describe(
        ":: GET /activities/team/:teamId/activity/fitness/member/:userTeamId", () => {

          it("Should return status 404 when teamId or userTeamId unknown", 
            async() => {
              let res1 = await chai.requester
                .get("/activities/team/100/activity/fitness/member/8")
                .set("Authorization", `Bearer ${coachUserToken}`);

              let res2 = await chai.requester
                .get("/activities/team/1/activity/fitness/member/100")
                .set("Authorization", `Bearer ${coachUserToken}`);

              expect(res1.statusCode).to.eql(404);
              expect(res2.statusCode).to.eql(404);
          });

          it("Should return team member assigned fitness activities with related exercises",
          async() => {
            let res = await chai.requester
              .get("/activities/team/1/activity/fitness/member/8")
              .set("Authorization", `Bearer ${athleteUserToken2}`);

            expect(res.statusCode).to.eql(200);

            let data = res.body.data[0];
            expect({
              userTeamId: data.teamMember.userTeamId,
              firstName: data.teamMember.firstName,
              lastName: data.teamMember.lastName,
              teamRole: data.teamMember.teamRole,
            }).to.eql(helperObjects.allFitnessActivities.teamMember2.userInfo);

            // Evaluate activity
            let resFitnessActivities = data.fitnessActivities;
            let athleteFitnessActivities =
              helperObjects.allFitnessActivities.teamMember2.fitnessActivities;

            for (let i = 0; i < resFitnessActivities; i++) {
              expect(resFitnessActivities[i].userTeamActivitiesId).to.eql(
                athleteFitnessActivities[i].userTeamActivitiesId
              );
              expect(resFitnessActivities[i].rpeValue).to.eql(
                athleteFitnessActivities[i].rpeValue
              );

              resFitnessActivities[i].exercises.forEach((resExercise, ii) => {
                let athleteExercise =
                  athleteFitnessActivities[i].exercises[ii];
                expect(resExercise.exercisesEquipmentId).to.eql(
                  athleteExercise.exercisesEquipmentId
                );
                expect(resExercise.exerciseName).to.eql(
                  athleteExercise.exerciseName
                );
                expect(resExercise.equipmentName).to.eql(
                  athleteExercise.equipmentName
                );
                expect(resExercise.exerciseSetsAmount).to.eql(
                  athleteExercise.exerciseSetsAmount
                );

                resExercise.exerciseSets.forEach((resExerciseSet, iii) => {
                  let athleteExerciseSet =
                    athleteFitnessActivities[i].exercises[ii]
                    .exerciseSets[iii];

                  expect(resExerciseSet).to.deep.equal(athleteExerciseSet);
                });
              });
            }
          });
      })

      describe(
        ":: GET /activities/team/:teamId/activity/fitness/member/:userTeamId/exercises/:userTeamActivityId ::", 
        () => {

        it("Should return 404 when unknown teamId, userTeamId and/or userTeamActivityId", 
        async() => {
          let res1 = await chai.requester
            .get("/activities/team/100/activity/3/fitness/member/8/exercises")
            .set("Authorization", `Bearer ${trainerUserToken}`);

          let res2 = await chai.requester
            .get("/activities/team/1/activity/100/fitness/member/8/exercises")
            .set("Authorization", `Bearer ${trainerUserToken}`);

          let res3 = await chai.requester
            .get("/activities/team/1/activity/3/fitness/member/100/exercises")
            .set("Authorization", `Bearer ${trainerUserToken}`);

          expect(res1.statusCode).to.eql(404);
          expect(res2.statusCode).to.eql(404);
          expect(res3.statusCode).to.eql(404);
        });

        it("Should return team member with assigned exercises of fitness activity",
        async() =>{
          let res = await chai.requester
            .get("/activities/team/1/activity/3/fitness/member/5/exercises")
            .set("Authorization", `Bearer ${trainerUserToken}`);

          expect(res.statusCode).to.eql(200);
          expect(res.body.data).to.be.ofSize(1);
          let data = res.body.data[0];
          expect({
            userTeamId: data.teamMember.userTeamId,
            firstName: data.teamMember.firstName,
            lastName: data.teamMember.lastName,
            teamRole: data.teamMember.teamRole,
          }).to.eql(helperObjects.allFitnessActivities.teamMember1.userInfo);
          expect(data).to.have.property("fitnessActivity");

          //TODO: Make this evaluation to function? Repeating 3-4 times in tests.
          // Evaluate activity exercises
          let resFitnessActivity = data.fitnessActivity;
          let athleteFitnessActivity = [
            helperObjects.allFitnessActivities.teamMember1.fitnessActivities[1]
          ];

          for (let i = 0; i < resFitnessActivity; i++) {
            expect(resFitnessActivity[i].userTeamActivitiesId).to.eql(
              athleteFitnessActivity[i].userTeamActivitiesId
            );
            expect(resFitnessActivity[i].rpeValue).to.eql(
              athleteFitnessActivity[i].rpeValue
            );

            resFitnessActivity[i].exercises.forEach((resExercise, ii) => { 
              let athleteExercise = athleteFitnessActivity[i].exercises[ii];
              expect(resExercise.exercisesEquipmentId).to.eql(
                athleteExercise.exercisesEquipmentId
              );
              expect(resExercise.exerciseName).to.eql(
                athleteExercise.exerciseName
              );
              expect(resExercise.equipmentName).to.eql(
                athleteExercise.equipmentName
              );
              expect(resExercise.exerciseSetsAmount).to.eql(
                athleteExercise.exerciseSetsAmount
              );

              resExercise.exerciseSets.forEach((resExerciseSet, iii) => {
                let athleteExerciseSet =
                  athleteFitnessActivity[i].exercises[ii].exerciseSets[iii];

                expect(resExerciseSet).to.deep.equal(athleteExerciseSet);
              });
            });
          }
        });
      });

      describe(
        ":: POST /activities/team/:teamId/activity/fitness/:activityId ::",
        () => {
          it("Should return 404 when teamId unknown", async() => {
            let res = await chai.requester
              .post("/activities/team/100/activity/fitness/3")
              .send({
                data: [helperObjects.validPostData[0]]
              })
              .set("Authorization", `Bearer ${coachUserToken}`);
            
            expect(res.statusCode).to.eql(404);
          })

          it("Should return 400 when data contain unknown id's", async() => {
            let res1 = await chai.requester
              .post("/activities/team/1/activity/fitness/3")
              .send({
                data: [helperObjects.invalidPostData[0]],
              })
              .set("Authorization", `Bearer ${trainerUserToken}`);

            let res2 = await chai.requester
              .post("/activities/team/1/activity/fitness/3")
              .send({
                data: [helperObjects.invalidPostData[1]],
              })
              .set("Authorization", `Bearer ${trainerUserToken}`);

            expect(res1.statusCode).to.eql(400);
            expect(res2.statusCode).to.eql(400);
          });

          it("Should return 400 when invalid value types provided within data",
          async() => {
            let res = await chai.requester
              .post("/activities/team/1/activity/fitness/2")
              .send({
                data: [helperObjects.invalidPostData[2]],
              })
              .set("Authorization", `Bearer ${trainerUserToken}`);

            expect(res.statusCode).to.eql(400);
          });

          it("Should return inserted exercise set", async() => {
            
            let res = await chai.requester
            .post("/activities/team/1/activity/fitness/2")
            .send({
              data: [helperObjects.validPostData[0]],
            })
            .set("Authorization", `Bearer ${trainerUserToken}`);
            
            expect(res.statusCode).to.eql(201);
            expect(res.body.data[0]).to.deep.equal({...helperObjects.validPostData[0], id: 17, assignedExVariation: null});
          });

          it("Should return inserted exercise sets",
            async() => {
              let res = await chai.requester
                .post("/activities/team/1/activity/fitness/2")
                .send({
                  data: [
                    helperObjects.validPostData[1],
                    helperObjects.validPostData[2]
                  ],
                })
                .set("Authorization", `Bearer ${trainerUserToken}`);

              expect(res.statusCode).to.eql(201);
              expect(res.body.data[0]).to.deep.equal({
                ...helperObjects.validPostData[1], id:18
              });
              expect(res.body.data[1]).to.deep.equal({
                ...helperObjects.validPostData[2], id:19,
                assignedExVariation: null
              });
          });
        });

    /*  describe(
        ":: POST /activities/team/:teamId/activity/fitness/:activityId ::",
          () => {
            it("Should return 404 when teamId unknown", async () => {});
          
            it("Should return 400 when data contain unknown id's", async () => {});
          
            it("Should return 400 when invalid value types provided within data", async () => {});

            it("Should return updated exercise set", async() => {})
            it("Should return updated exercise sets", async() => {})

            it("Should return status", async() => {})
          }
      );
 */
    });
});
