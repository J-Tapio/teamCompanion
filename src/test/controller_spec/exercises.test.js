import Exercises from "../../../db/models/exercises.model.js";
import testHelpers from "../_test_helpers.js";
const chai = testHelpers.getChai();
const { insertData } = testHelpers;
const expect = chai.expect;


describe("::: EXERCISES CONTROLLER TESTS :::", () => {
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


    describe("::With invalid / missing token / no priviledges::", () => {
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

      it("Should return status 403 when user is not admin / coach / trainer", async () => {
        const res1 = await chai.requester
          .get("/exercises")
          .set("authorization", `Bearer ${athleteUserToken}`);
        const res2 = await chai.requester
          .get("/exercises/5")
          .set("authorization", `Bearer ${athleteUserToken}`);
        const res3 = await chai.requester
          .post("/exercises")
          .set("authorization", `Bearer ${athleteUserToken}`)
          .send({
            exerciseName: "Deadlift",
          });
        const res4 = await chai.requester
          .put("/exercises/2")
          .set("authorization", `Bearer ${athleteUserToken}`)
          .send({ exerciseName: "Should not go through." });
        const res5 = await chai.requester
          .delete("/exercises/1")
          .set("authorization", `Bearer ${athleteUserToken}`);
        const res6 = await chai.requester
          .get("/exercises/create")
          .set("authorization", `Bearer ${athleteUserToken}`);

        const res7 = await chai.requester
          .get("/exercises/create")
          .set("authorization", `Bearer ${athleteUserToken}`);

        expect(res1.statusCode).to.eql(403);
        expect(res2.statusCode).to.eql(403);
        expect(res3.statusCode).to.eql(403);
        expect(res4.statusCode).to.eql(403);
        expect(res5.statusCode).to.eql(403);
        expect(res6.statusCode).to.eql(403);
        expect(res7.statusCode).to.eql(403);
      });
    });

    describe(":: GET - /exercises ::", () => {

      it("Should return exercises when user is admin / coach / trainer", async () => {
        const res1 = await chai.requester
          .get("/exercises")
          .set("authorization", `Bearer ${adminUserToken}`);

        expect(res1.statusCode).to.eql(200);
        expect(res1.body.count).to.eql(6);
        expect(res1.body.data).to.be.ofSize(6);
        expect(res1.body.data[0].equipment[0]).to.have.all.keys(
          "equipmentId",
          "equipmentName",
          "equipmentInfo",
          "trainingModality",
          "exerciseVariations",
          "exercisePositions",
          "exerciseInformation"
        );
        expect(res1.body.data[0].id).to.eql(1);
        expect(res1.body.data[0].exerciseName).to.eql("Cycling");
        expect(res1.body.data[0].exerciseInfo).to.be.null;
        expect(res1.body.data[0].equipment).to.be.ofSize(1);
        expect(res1.body.data[2].id).to.eql(3);
        expect(res1.body.data[2].equipment).to.be.ofSize(2);
        expect(res1.body.data[2].equipment[0].equipmentId).to.eql(3);
        expect(res1.body.data[2].equipment[0].equipmentName).to.eql("Barbell");
        expect(res1.body.data[2].equipment[1].equipmentId).to.eql(6);
        expect(res1.body.data[2].equipment[1].equipmentName).to.eql(
          "Kettlebell"
        );

        const res2 = await chai.requester
          .get("/exercises")
          .set("authorization", `Bearer ${coachUserToken}`);
        expect(res2.statusCode).to.eql(200);
        expect(res2.body.data.length).to.eql(6);

        const res3 = await chai.requester
          .get("/exercises")
          .set("authorization", `Bearer ${trainerUserToken}`);
        expect(res3.statusCode).to.eql(200);
        expect(res3.body.data.length).to.eql(6);
      });
    });

    describe(":: GET - /exercises/:id", () => {
      it("Should return status 404 when unknown exercise id", async () => {
        const res = await chai.requester
          .get("/exercises/100")
          .set("authorization", `Bearer ${coachUserToken}`);
        expect(res.statusCode).to.eql(404);
      });

      //! Does contain only one equipment within array of equipment property.
      it("Should return exercise by exercise id", async () => {
        const res1 = await chai.requester
          .get("/exercises/2")
          .set("authorization", `Bearer ${adminUserToken}`);

        expect(res1.statusCode).to.eql(200);
        expect(res1.body).to.have.all.keys(
          "id",
          "exerciseName",
          "exerciseInfo",
          "equipment"
        );
        expect(res1.body.id).to.eql(2);
        expect(res1.body.exerciseName).to.eql("Rope Swing");
        expect(res1.body.equipment).to.be.array();
        expect(res1.body.equipment).to.be.ofSize(1);
        expect(res1.body.equipment[0]).to.be.have.all.keys(
          "equipmentId",
          "equipmentName",
          "equipmentInfo",
          "trainingModality",
          "exerciseVariations",
          "exercisePositions",
          "exerciseInformation"
        );
        expect(res1.body.equipment[0].exerciseVariations).to.be.array();
        expect(res1.body.equipment[0].exerciseVariations).to.be.ofSize(3);
        expect(res1.body.equipment[0].equipmentId).to.eql(5);
        expect(res1.body.equipment[0].equipmentName).to.eql("Ropes");
        expect(res1.body.equipment[0].exerciseVariations).to.be.containingAllOf(
          ["Right Side", "Left Side", "Alternating"]
        );

        expect(res1.body.equipment[0].exercisePositions).to.be.null;
        expect(res1.body.equipment[0].exerciseInformation).to.be.null;

        // !Contains two objects within equipment array.
        const res2 = await chai.requester
          .get("/exercises/3")
          .set("authorization", `Bearer ${adminUserToken}`);

        expect(res2.statusCode).to.eql(200);
        expect(res2.body).to.be.have.all.keys(
          "id",
          "exerciseName",
          "exerciseInfo",
          "equipment"
        );
        expect(res2.body.equipment).to.be.array();
        expect(res2.body.equipment).to.be.ofSize(2);
        expect(res2.body.equipment[0].equipmentId).to.eql(3);
        expect(res2.body.equipment[1].equipmentId).to.eql(6);
        expect(res2.body.equipment[0].exerciseVariations).to.be.array();
        expect(res2.body.equipment[0].exerciseVariations).to.be.ofSize(6);
        expect(res2.body.equipment[0].exerciseVariations).to.be.containingAllOf(
          [
            "Stiff-Legged",
            "Romanian",
            "Sumo",
            "Narrow-Stance",
            "Hook-Grip",
            "Mixed-Grip",
          ]
        );
        expect(res2.body.equipment[1]).to.be.have.all.keys(
          "equipmentId",
          "equipmentName",
          "equipmentInfo",
          "trainingModality",
          "exerciseVariations",
          "exercisePositions",
          "exerciseInformation"
        );
        expect(res2.body.equipment[1].exerciseVariations).to.be.null;
      });
    });

    describe(":: POST - /exercises", () => {

      beforeEach(async() => {
        await insertData();
      })

      it("Should return status 400 when providing invalid data", async () => {
        const res = await chai.requester
          .post("/exercises")
          .set("authorization", `Bearer ${coachUserToken}`)
          .send({
            exerciseName: "Invalid",
            invalidProperty: "invalid",
          });

        expect(res.statusCode).to.eql(400);
      });

      it("Should return status 400 when exercise already exists", async () => {
        const res = await chai.requester
          .post("/exercises")
          .set("authorization", `Bearer ${coachUserToken}`)
          .send({
            exerciseName: "Deadlift",
          });

        expect(res.statusCode).to.eql(400);
      });

      it("Should return status 201 & created exercise when exercise is created", async () => {
        //! Exercise 1.
        const res1 = await chai.requester
          .post("/exercises")
          .set("authorization", `Bearer ${trainerUserToken}`)
          .send({
            exerciseName: "TrainerEx",
            exerciseInfo: "Trainer notes.",
          });

        expect(res1.statusCode).to.eql(201);
        expect(res1.body).to.have.all.keys(
          "id",
          "exerciseName",
          "exerciseInfo",
          "createdAt"
        );

        expect(res1.body.id).to.eql(7);
        expect(res1.body.exerciseName).to.eql("TrainerEx");
        expect(res1.body.exerciseInfo).to.eql("Trainer notes.");
        const dbResult1 = await Exercises.query().select("createdBy").where("id", 7).first();
        expect(dbResult1.createdBy).to.eql(4);


        //! Exercise 2.
        const res2 = await chai.requester
          .post("/exercises")
          .set("authorization", `Bearer ${coachUserToken}`)
          .send({
            exerciseName: "CoachEx",
          });

        expect(res2.statusCode).to.eql(201);
        expect(res2.body).to.have.all.keys(
          "id",
          "exerciseName",
          "exerciseInfo",
          "createdAt"
        );
        expect(res2.body.id).to.eql(8);
        expect(res2.body.exerciseName).to.eql("CoachEx");
        expect(res2.body.exerciseInfo).to.be.null;
        const dbResult2 = await Exercises.query()
          .select("createdBy")
          .where("id", 8).first();
        expect(dbResult2.createdBy).to.eql(2);

      });
    });

    describe(":: PUT - /exercises/:id ::", () => {
      //TODO: COME BACK HERE LATER
      it("Should return status 403 when exercise creator or admin is not making the request", async () => {
        const res1 = await chai.requester
          .put("/exercises/1")
          .send({ exerciseName: "Not going to happen" })
          .set("authorization", `Bearer ${athleteUserToken}`);
        expect(res1.statusCode).to.eql(403);

        const res2 = await chai.requester
          .put("/exercises/1")
          .send({ exerciseName: "Not going to happen" })
          .set("authorization", `Bearer ${trainerUserToken}`);
        expect(res2.statusCode).to.eql(403);

        const res3 = await chai.requester
          .put("/exercises/1")
          .send({ exerciseName: "Not going to happen" })
          .set("authorization", `Bearer ${coachUserToken}`);
        expect(res2.statusCode).to.eql(403);
      });

      it("Should return status 404 when unknown exercise id", async () => {
        const res = await chai.requester
          .put("/exercises/10")
          .send({
            exerciseName: "Should not be found.",
          })
          .set("authorization", `Bearer ${trainerUserToken}`);

        expect(res.statusCode).to.eql(404);
      });

      it("Should return status 200 / updated exercise when updated by exercise creator", async () => {
        const res = await chai.requester
          .put("/exercises/7")
          .set("authorization", `Bearer ${trainerUserToken}`)
          .send({ exerciseName: "ModifiedByCreator" });

        expect(res.statusCode).to.eql(200);
        expect(res.body.exerciseName).to.eql("ModifiedByCreator");
        expect(res.body.exerciseInfo).to.eql("Trainer notes.");
      });

      it("Should return status 200 / updated exercise updated by admin", async () => {
        const res = await chai.requester
          .put("/exercises/2")
          .set("authorization", `Bearer ${trainerUserToken}`)
          .send({
            exerciseName: "ModifiedByAdmin",
            exerciseInfo: "Exerciseinfo added.",
          });

        expect(res.statusCode).to.eql(200);
        expect(res.body.exerciseName).to.eql("ModifiedByAdmin");
        expect(res.body.exerciseInfo).to.eql("Exerciseinfo added.");
      });
    });

    describe(":: DELETE - /exercises/:id ::", () => {
      it("Should return status 404 when unknown id", async () => {
        const res1 = await chai.requester
          .delete("/exercises/10")
          .set("authorization", `Bearer ${coachUserToken}`);

        const res2 = await chai.requester
          .delete("/exercises/10")
          .set("authorization", `Bearer ${trainerUserToken}`);

        const res3 = await chai.requester
          .delete("/exercises/10")
          .set("authorization", `Bearer ${adminUserToken}`);

        expect(res1.statusCode).to.eql(404);
        expect(res2.statusCode).to.eql(404);
        expect(res3.statusCode).to.eql(404);
      });

      it("Should return status 403 when exercise being deleted by user who did not create the exercise", async () => {
        const res1 = await chai.requester
          .delete("/exercises/1")
          .set("authorization", `Bearer ${trainerUserToken}`);
        expect(res1.statusCode).to.eql(403);

        const res2 = await chai.requester
          .delete("/exercises/3")
          .set("authorization", `Bearer ${trainerUserToken}`);
        expect(res2.statusCode).to.eql(403);
      });

      it("Should return status 204 when exercise is deleted", async () => {
        const res1 = await chai.requester
          .delete("/exercises/2")
          .set("authorization", `Bearer ${trainerUserToken}`);

        const res2 = await chai.requester
          .delete("/exercises/3")
          .set("authorization", `Bearer ${adminUserToken}`);

        expect(res1.statusCode).to.eql(204);
        expect(res2.statusCode).to.eql(204);

        const dbRowsExercise = await Exercises.query().select("id");

        //! EARLIER POST CREATED TWO NEW EXERCISE
        expect(dbRowsExercise).to.be.ofSize(6);
        expect(dbRowsExercise).to.not.be.containing(2);
        expect(dbRowsExercise).to.not.be.containing(3);
      });
    });

    //! Exercise/Equipment:
    describe(":: GET - /exercises/create ::", () => {

      before(async () => {
        await insertData();
      });

      it("Should return 403 when user not admin / coach / trainer", async () => {
        const res = await chai.requester
          .get("/exercises/create")
          .set("authorization", `Bearer ${athleteUserToken}`);

        expect(res.statusCode).to.eql(403);
      });
      
      it("Should return exercises & equipment with id and name", async () => {
        const res1 = await chai.requester
          .get("/exercises/create")
          .set("authorization", `Bearer ${adminUserToken}`);

        expect(res1.statusCode).to.eql(200);
        expect(res1.body.data.exercises).to.be.ofSize(6);
        expect(res1.body.data.equipment).to.be.ofSize(6);
        expect(res1.body.data.exercises[0]).to.have.all.keys(
          "id",
          "exerciseName"
        );
        expect(res1.body.data.equipment[0]).to.have.all.keys(
          "id",
          "equipmentName"
        );
        const exercises = res1.body.data.exercises.map((ex) => ex.exerciseName);
        const equipment = res1.body.data.equipment.map(
          (eq) => eq.equipmentName
        );

        expect(exercises).to.be.containingAllOf([
          "Cycling",
          "Shoulder Press",
          "Rowing",
          "Back Squat",
          "Rowing",
          "Back Squat",
        ]);
        expect(equipment).to.be.containingAllOf([
          "Rowing Machine",
          "Indoor Bike",
          "Barbell",
          "Exercise Machine",
          "Ropes",
          "Kettlebell",
        ]);

        const res2 = await chai.requester
          .get("/exercises/create")
          .set("authorization", `Bearer ${coachUserToken}`);
        expect(res2.statusCode).to.eql(200);
        expect(res2.body.data.exercises).to.be.ofSize(6);
        expect(res2.body.data.equipment).to.be.ofSize(6);

        const res3 = await chai.requester
          .get("/exercises/create")
          .set("authorization", `Bearer ${trainerUserToken}`);
        expect(res3.statusCode).to.eql(200);
        expect(res3.body.data.exercises).to.be.ofSize(6);
        expect(res3.body.data.equipment).to.be.ofSize(6);
      });
    });

    describe(":: POST - /exercises/create ::", () => {

      beforeEach(async () => {
        await insertData();
      });

      it("Should return 403 when user not admin / coach / trainer", async () => {
        const res = await chai.requester
          .post("/exercises/create")
          .send({equipmentId: 2, exerciseId: 4})
          .set("authorization", `Bearer ${athleteUserToken}`);
        expect(res.statusCode).to.eql(403);
      });

      it("Should be able to create exercise by name when equipment known", async () => {

        const res = await chai.requester
          .post("/exercises/create")
          .send({
            equipmentId: 2,
            exerciseName: "New Exercise",
            exerciseInfo: "New exercise created and attached to equipment",
            exerciseVariations: ["Mixed-grip", "Right Side", "Left Side"],
            // exercisePositions left out
            exerciseInformation:
              "New exercise will be done with known equipment in this way.",
          })
          .set("authorization", `Bearer ${coachUserToken}`);

          console.log(res.body);

        expect(res.statusCode).to.eql(201);
        expect(res.body.exerciseId).to.eql(7);
        expect(res.body).to.have.all.keys(
          "exerciseId",
          "exerciseInfo",
          "equipmentId",
          "equipmentName",
          "equipmentInfo",
          "exerciseName",
          "exerciseVariations",
          "exercisePositions",
          "exerciseInformation",
          "trainingModality",
          "createdAt"
        );
        expect(res.body.exerciseVariations).to.be.ofSize(3);
        expect(res.body.exerciseVariations).to.be.containingAllOf([
          "Mixed-grip",
          "Right Side",
          "Left Side",
        ]);
        expect(res.body.exercisePositions).to.be.null;
        expect(res.body.exerciseName).to.eql("New Exercise");
        expect(res.body.equipmentName).to.eql("Indoor Bike")
        expect(res.body.exerciseInfo).to.eql(
          "New exercise created and attached to equipment"
        );
        expect(res.body.exerciseInformation).to.eql(
          "New exercise will be done with known equipment in this way."
        );
        expect(res.body.equipmentId).to.eql(2);
        expect(res.body.trainingModality).to.eql("Cardio");
      });

      it("Should be able to create equipment by name when exercise known", async () => {
        const res = await chai.requester
          .post("/exercises/create")
          .send({
            exerciseId: 6,
            equipmentName: "New Equipment",
            equipmentInfo: "New equipment created and attached to exercise",
            trainingModality: "Strength",
            exerciseVariations: [
              "Alternating Sides",
              "Right Side",
              "Left Side",
            ],
            exercisePositions: ["Standing", "Sitting"],
          })
          .set("authorization", `Bearer ${coachUserToken}`);

        expect(res.statusCode).to.eql(201);
        expect(res.body.equipmentName).to.eql("New Equipment");
        expect(res.body.equipmentId).to.eql(7);
        expect(res.body.exerciseName).to.eql("Back Squat");
        expect(res.body.trainingModality).to.eql("Strength");
        expect(res.body.exerciseVariations).to.be.ofSize(3);
        expect(res.body.exerciseVariations).to.be.containingAllOf([
          "Alternating Sides",
          "Right Side",
          "Left Side",
        ]);
        expect(res.body.exercisePositions).to.be.containingAllOf([
          "Standing",
          "Sitting",
        ]);
        expect(res.body.equipmentInfo).to.eql(
          "New equipment created and attached to exercise"
        );
        expect(res.body.exerciseInfo).to.be.null;
        expect(res.body.exerciseInformation).to.be.null;
      });

      it("Should be able to create new exercise & equipment which are both unknown", async () => {
        let res = await chai.requester
          .post("/exercises/create")
          .send({
            exerciseName: "Totally new exercise",
            equipmentName: "Totally new equipment",
            trainingModality: "Strength",
          })
          .set("authorization", `Bearer ${adminUserToken}`);

        expect(res.statusCode).to.eql(201);
        expect(res.body.exerciseName).to.eql("Totally new exercise");
        expect(res.body.equipmentName).to.eql("Totally new equipment");
        expect(res.body.exerciseId).to.eql(7);
        expect(res.body.equipmentId).to.eql(7);
        expect(res.body.trainingModality).to.eql("Strength");
        expect(res.body.exerciseInfo).to.be.null;
        expect(res.body.equipmentInfo).to.be.null;
        expect(res.body.exerciseVariations).to.be.null;
        expect(res.body.exercisePositions).to.be.null;
        expect(res.body.exerciseInformation).to.be.null;
      });
    });

    //! DELETE DB DATA - CHECK WHAT IS RETURNED
    describe(":: GET - /exercises ::", () => {
      it("Should return status 404 when no data is available", async () => {
        await Exercises.query().delete();

        const res = await chai.requester
          .get("/exercises")
          .set("authorization", `Bearer ${adminUserToken}`);

        expect(res.statusCode).to.eql(404);
      });
    });
  }
);