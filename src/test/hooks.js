import { initializeDBAndServer, teardownDBAndServer } from "./_test_helpers.js";

export const mochaHooks = {
  beforeAll: initializeDBAndServer,
  afterAll: teardownDBAndServer
}
