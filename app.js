import dotenv from "dotenv";
import Knex from "knex";
import { Model } from "objection";
import Fastify from "fastify";
import fastifyCors from "fastify-cors";
import fastifySwagger from "fastify-swagger";
import fastifyPrintRoutes from "fastify-print-routes";
import fastifyBcrypt from "fastify-bcrypt";
import fastifySensible from "fastify-sensible";
import fp from "fastify-plugin";
import knexConfiguration from "./knexfile.js";
import {
  authPlugin,
  checkStaffAdminRolePlugin,
  checkTrainingAdminRolePlugin,
  checkActivitiesPriviledgePlugin,
  checkForUnknownUrlIdsPlugin
} from "./src/plugins/fastifyPlugins.js";
import appRoutes from "./src/routes/index.js";
import { adminCheck } from "./src/decorators/fastifyDecorators.js";

dotenv.config({ path: "./.env" });

// Initialize Knex / Objection
export const db = Knex(knexConfiguration.development);
Model.knex(db);


const fastify = Fastify({
  logger: {
    prettyPrint: true,
    level: "error",
  },
});


fastify.register(fastifyCors); // Specify whitelist later.
fastify.register(fastifyPrintRoutes);
fastify.register(fastifySwagger, {
  exposeRoute: true,
  routePrefix: "/documentation",
  swagger: {
    info: {
      title: "TeamCompanion",
      description: "Team Companion API",
      version: "0.1.0",
    },
    host: "https://teamcompanion.juha-tap.io/",
  },
});
fastify.register(fastifySensible);
fastify.register(fastifyBcrypt, { saltWorkFactor: 14 });
fastify.register(fp(authPlugin));
fastify.register(fp(checkStaffAdminRolePlugin));
fastify.register(fp(checkTrainingAdminRolePlugin));
fastify.register(fp(checkActivitiesPriviledgePlugin));
fastify.register(fp(checkForUnknownUrlIdsPlugin));
fastify.decorate("checkAdminRole", adminCheck);

appRoutes.forEach((endpoint) => {
  fastify.route(endpoint);
});

export default fastify;
