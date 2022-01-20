import UserActivities from "../../../db/models/userActivities.model.js";
import UserInformation from "../../../db/models/userInformation.model.js";
import Users from "../../../db/models/users.model.js";
import UserTeams from "../../../db/models/userTeams.model.js";
import testHelpers from "../_test_helpers.js";
import { QueryBuilder, ref } from "objection";
import knex from "knex";
const chai = testHelpers.getChai();
const { insertData } = testHelpers;
const expect = chai.expect;

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

    describe(":: With invalid / missing token / no priviledges :: ", () => {
      it.only("Test db", async() => {

        const staffInfo = await UserActivities.query()
          .joinRelated({activities: true})
          .select(
            "userActivities.id",
            "userActivities.athleteId",
            "userActivities.activityId",
            "activities.activityType",
            "userActivities.activityStart",
            "userActivities.activityEnd",
            "userActivities.rpeValue",
            "userActivities.createdBy",
            "staff.firstName as staffFirstName",
            "staff.LastName as staffLastName",
            "athlete.firstName as athleteFirstName",
            "athlete.lastName as athleteLastName"
          )
          .join("userTeams as staffTeam", "userActivities.createdBy", "=", "staffTeam.id")
          .innerJoin("userInformation as staff", "staffTeam.userId", "=", "staff.userId")
          .join("userTeams as athleteTeam", "userActivities.athleteId", "=",
          "athleteTeam.id")
          .innerJoin("userInformation as athlete", "athleteTeam.userId", "=",
          "athlete.userId")

          console.log(staffInfo);
        })
      });
    })