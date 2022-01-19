import testHelpers from "../_test_helpers.js";
const chai = testHelpers.getChai();
const { insertData } = testHelpers;
const expect = chai.expect;
import Equipment from "../../../db/models/equipment.model.js";


describe("::: EQUIPMENT CONTROLLER TESTS :::", () => {
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

  
  describe(":::With invalid / missing token / no priviledges:::", () => {
      it("Should return status 400 without token in headers", async () => {
        const res = await chai.requester.get("/equipment");
        expect(res.statusCode).to.eql(400);
      });

      it("Should return status 400 when token is invalid", async () => {
        const res = await chai.requester
          .get("/equipment")
          .set("authorization", "Bearer invalid");
        expect(res.statusCode).to.eql(400);
      });

      it("Should return status 403 when user is not admin / coach / trainer", async () => {
        const res1 = await chai.requester
          .get("/equipment")
          .set("authorization", `Bearer ${athleteUserToken}`);
        const res2 = await chai.requester
          .get("/equipment/4")
          .set("authorization", `Bearer ${athleteUserToken}`);
        const res3 = await chai.requester
          .post("/equipment")
          .set("authorization", `Bearer ${athleteUserToken}`)
          .send({
            exerciseName: "Invalid",
          });
        const res4 = await chai.requester
          .put("/equipment/2")
          .set("authorization", `Bearer ${athleteUserToken}`)
          .send({ exerciseName: "Should not go through." });
        const res5 = await chai.requester
          .delete("/equipment/1")
          .set("authorization", `Bearer ${athleteUserToken}`);

        expect(res1.statusCode).to.eql(403);
        expect(res2.statusCode).to.eql(403);
        expect(res3.statusCode).to.eql(403);
        expect(res4.statusCode).to.eql(403);
        expect(res5.statusCode).to.eql(403);
      });
  });

  describe("::: GET /equipment :::", () => {
    it("Should return equipment when user is admin / coach / trainer",
    async() => {
      let res1 = await chai.requester
        .get("/equipment")
        .set("authorization", `Bearer ${adminUserToken}`);

        expect(res1.statusCode).to.eql(200);
        expect(res1.body.count).to.eql(6);
        expect(res1.body.data).to.be.ofSize(6);
        res1.body.data.forEach((equipment) => {
          return expect(equipment).to.have.all.keys(
            "id",
            "equipmentName",
            "trainingModality",
            "equipmentInfo",
            "exercises"
          );
        });
        expect(res1.body.data[0].exercises[0]).to.have.all.keys(
          "exerciseId",
          "exerciseName",
          "exerciseInfo",
          "exerciseVariations",
          "exercisePositions",
          "exerciseInformation"
        )

      let res2 = await chai.requester
        .get("/equipment")
        .set("authorization", `Bearer ${coachUserToken}`);
        expect(res2.statusCode).to.eql(200);
        expect(res2.body.count).to.eql(6);
        expect(res2.body.data).to.be.ofSize(6);

      let res3 = await chai.requester
        .get("/equipment")
        .set("authorization", `Bearer ${trainerUserToken}`);
        expect(res3.statusCode).to.eql(200);
        expect(res3.body.count).to.eql(6);
        expect(res3.body.data).to.be.ofSize(6);
    })
  });
  
  describe("::: POST /equipment :::", () => {

    beforeEach(async() => {
      await insertData();
    });

    it("Should return status 400 when providing invalid data", async() => {
      let res1 = await chai.requester
        .post("/equipment")
        .send({
          equipmentName: "Barbell",
          trainingModality: "Strength",
          invalidProperty: "I shall not pass!",
        })
        .set("authorization", `Bearer ${trainerUserToken}`);

      let res2 = await chai.requester
        .post("/equipment")
        .send({
          equipment: "New equipment",
          modality: "strength",
        })
        .set("authorization", `Bearer ${trainerUserToken}`);

      let res3 = await chai.requester
        .post("/equipment")
        .send({
          equipmentName: "",
          trainingModality: "Strength",
        })
        .set("authorization", `Bearer ${trainerUserToken}`);

      let res4 = await chai.requester
        .post("/equipment")
        .send({
          equipmentName: "New equipment",
          trainingModality: "",
        })
        .set("authorization", `Bearer ${trainerUserToken}`);

        expect(res1.statusCode).to.eql(400);
        expect(res2.statusCode).to.eql(400);
        expect(res3.statusCode).to.eql(400);
        expect(res4.statusCode).to.eql(400);
    });

    it("Should return status 400 when equipment already exists", async() => {
      let res = await chai.requester
        .post("/equipment")
        .send({
          equipmentName: "Barbell",
          trainingModality: "Strength",
        })
        .set("authorization", `Bearer ${trainerUserToken}`);
      expect(res.statusCode).to.eql(400);
    });

    it("Should return status 201 & created equipment when equipment is created",
    async() => {
      let res = await chai.requester
        .post("/equipment")
        .send({
          equipmentName: "Resistance Band",
          trainingModality: "Strength",
        })
        .set("authorization", `Bearer ${trainerUserToken}`);

      expect(res.statusCode).to.eql(201);
      expect(res.body).to.have.all.keys("id", "equipmentName", "trainingModality", "equipmentInfo", "createdAt");
      expect(res.body.id).to.eql(7);
      expect(res.body.equipmentName).to.eql("Resistance Band");
      expect(res.body.equipmentInfo).to.be.null;
      expect(res.body.trainingModality).to.eql("Strength");
      
      const {createdBy} = await Equipment.query().select("createdBy").where("createdBy", 4).first();
      expect(createdBy).to.eql(4);
    });
  });

  describe("::: GET /equipment/:id :::", () => {
    it("Should return status 404 when unknown equipment id", async() => {
      let res = await chai.requester
        .get("/equipment/10")
        .set("authorization", `Bearer ${adminUserToken}`);
      expect(res.statusCode).to.eql(404);
    })
    it("Should return equipment by known equipment id", async() => {
      let res = await chai.requester
        .get("/equipment/3")
        .set("authorization", `Bearer ${adminUserToken}`);

        console.log(res.body);
      
      expect(res.statusCode).to.eql(200);
      expect(res.body).to.have.all.keys(
        "id", "equipmentName", "trainingModality", "equipmentInfo", "exercises"
      );
      expect(res.body.id).to.eql(3);
      expect(res.body.equipmentName).to.eql("Barbell");
      expect(res.body.trainingModality).to.eql("Strength");
      expect(res.body.exercises).to.be.ofSize(3);
      expect(res.body.exercises[0].exerciseId).to.eql(3); 
      expect(res.body.exercises[1].exerciseId).to.eql(4); 
      expect(res.body.exercises[2].exerciseId).to.eql(6);
      expect(res.body.exercises[0].exerciseName).to.eql("Deadlift") 
      expect(res.body.exercises[1].exerciseName).to.eql("Shoulder Press") 
      expect(res.body.exercises[2].exerciseName).to.eql("Back Squat"); 
      expect(res.body.exercises[0].exerciseVariations).to.be.array();
      expect(res.body.exercises[1].exerciseVariations).to.be.null;
      expect(res.body.exercises[2].exerciseVariations).to.be.null;
    });
  });

  describe("::: PUT /equipment/:id :::", () => {
    it("Should return status 403 when equipment creator or admin is not making the request", () => {});

    it("Should return status 404 when unknown equipment id", async() => {});

    it("Should return status 200 & updated exercise when updated by equipment creator", async() => {});

    it("Should return status 200 & updated exercise when updated by admin", async() => {});
  });


  describe("::: DELETE /equipment/:id :::", () => {
    it("Should return status 404 when unknown id", async() => {
      let res = await chai.requester
        .delete("/equipment/10")
        .set("authorization", `Bearer ${adminUserToken}`);
      expect(res.statusCode).to.eql(404);
    });

    it("Should return status 403 when equipment being deleted by user who did not create the exercise", async() => {
      let res = await chai.requester
        .delete("/equipment/1")
        .set("authorization", `Bearer ${trainerUserToken}`);
      expect(res.statusCode).to.eql(403);
    });

    it("Should return status 204 when equipment is deleted", async() => {
      let res = await chai.requester
        .delete("/equipment/2")
        .set("authorization", `Bearer ${adminUserToken}`);
      expect(res.statusCode).to.eql(204);

      let dbEquipment = await Equipment.query().select("id");
      //! Earlier POST request created one more equipment
      expect(dbEquipment).to.be.ofSize(6);
      expect(dbEquipment).to.not.be.containing(2);
    })
  });

  //! WHEN DB DOES NOT CONTAIN ANY EQUIPMENT
  describe("::: GET /equipment :::", () => {
    it("Should return status 404 when no data available", async() => {
      await Equipment.query().del();

      let res = await chai.requester
        .get("/exercises")
        .set("authorization", `Bearer ${adminUserToken}`);
      expect(res.statusCode).to.eql(404);
    });
  });

});
