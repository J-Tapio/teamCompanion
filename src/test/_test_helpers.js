import { db } from "../../app.js";
import server from "../../app.js";
import chai from "chai";
import assertArrays from "chai-arrays";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
chai.use(assertArrays);
const PORT = process.env.PORT || 3005;
/*   .then((server) => (chai.requester = chai.request(server).keepOpen())); */

export async function initializeDBAndServer() {
  try {
    server.listen({ port: PORT }, function initializeChaiRequester(error, address) {
      if(error) {
        server.log.error(error);
      } else {
        chai.requester = chai.request(address).keepOpen();
      }
    })
    console.log("Fastify - SERVER STARTED");
    await db.migrate.latest();
    console.log("Knex/DB - Migrated to latest");
  } catch (error) {
    console.error(error);
  }
}

export async function teardownDBAndServer() {
  try {
    // Knex
    await db.migrate.rollback({ all: true });
    await db.destroy();
    // Fastify-server
    server.close();
    console.log("Fastify - SERVER CLOSED");
  } catch (error) {
    console.error(error);
  }
}

export async function insertData() {
  try {
    console.log("Knex/DB - Insert data to tables");
    await db.seed.run();
  } catch (error) {
    console.error(error);
  }
}

//! Runs within every test-file. Better solution would be to run once and make the logged in users available within test-files? Unfortunately insertData runs also within before hook in every test-file. Hence, user-login per file needs to be done after.

export async function logInUsers(chai) {
  try {
    console.log("Loggin in users");
    let adminUserToken = (
      await chai.requester
        .post("/login")
        .send({ email: "admin@mail.com", password: "admin123" })
    ).body.accessToken;

    let coachUserToken = (
      await chai.requester
        .post("/login")
        .send({ email: "coach@mail.com", password: "coach123" })
    ).body.accessToken;

    let trainerUserToken = (
      await chai.requester
        .post("/login")
        .send({ email: "trainer@mail.com", password: "trainer123" })
    ).body.accessToken;

    let athleteUserToken = (
      await chai.requester
        .post("/login")
        .send({ email: "athlete@mail.com", password: "athlete123" })
    ).body.accessToken;

    let physioUserToken = (
      await chai.requester
        .post("/login")
        .send({ email: "physio@mail.com", password: "physio123" })
    ).body.accessToken;

    let staffUserToken = (
      await chai.requester
        .post("/login")
        .send({ email: "staff@mail.com", password: "staff123" })
    ).body.accessToken;

    return {
      adminUserToken,
      coachUserToken,
      trainerUserToken,
      athleteUserToken,
      physioUserToken,
      staffUserToken,
    };
  } catch (error) {
    console.log("Error while loggin in users");
    console.error(error);
  }
}

export default {
  getServer: () => server,
  getChai: () => chai,
  insertData: insertData,
  logInUsers: logInUsers,
};
