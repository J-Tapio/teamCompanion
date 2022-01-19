import { db } from "../../app.js";
import server from "../../app.js";
import chai from "chai";
import assertArrays from "chai-arrays";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
chai.use(assertArrays)

server.listen(3005).then((server) => chai.requester = chai.request(server).keepOpen());

export async function initializeDB() {
  try {
    await db.migrate.latest();
  } catch (error) {
    console.log(error);
  }
}

export async function tearDownDBAndServer() {
  try {
    // Knex
    await db.migrate.rollback({ all: true });
    await db.destroy();
    // Fastify-server
    server.close();
    console.log("Fastify - SERVER CLOSED");
  } catch (error) {
    console.log(error);
  }
}

export async function insertData() {
  try {
    console.log("Knex/DB - Insert data to tables");
    await db.seed.run();
  } catch (error) {
    console.log(error);
  }
}

export default {
  getServer: () => server,
  getChai: () => chai,
  insertData: insertData,
}

