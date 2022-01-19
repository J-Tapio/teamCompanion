import { initializeDB, tearDownDBAndServer } from "./_test_helpers.js";

export const mochaHooks = {
  beforeAll: initializeDB,
  afterAll: tearDownDBAndServer
}
