// Imports =====================================================================
import 'dotenv/config';
import Knex from "knex";
import { Model } from "objection";
import Fastify from "fastify";
import fastifyCors from "fastify-cors";
import fastifySwagger from "fastify-swagger";
import fastifyPrintRoutes from "fastify-print-routes";
import fastifyBcrypt from "fastify-bcrypt";
import fastifySensible from "fastify-sensible";
import fastifyMultipart from "fastify-multipart";
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


// Initialize Knex / Objection =================================================
export const db = Knex(knexConfiguration.development);
Model.knex(db);

// Initialize Fastify & register plugins, routes etc. ==========================
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
fastify.register(fastifyMultipart);
fastify.register(fp(authPlugin));
fastify.register(fp(checkStaffAdminRolePlugin));
fastify.register(fp(checkTrainingAdminRolePlugin));
fastify.register(fp(checkActivitiesPriviledgePlugin));
fastify.register(fp(checkForUnknownUrlIdsPlugin));
fastify.decorate("checkAdminRole", adminCheck);

// Register routes
appRoutes.forEach((endpoint) => {
  fastify.route(endpoint);
});

export default fastify;
