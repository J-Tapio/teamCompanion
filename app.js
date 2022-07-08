import 'dotenv/config';
import Knex from "knex";
import { Model } from "objection";
import Fastify from "fastify";
import fastifyCors from '@fastify/cors';
import fastifySwagger from "fastify-swagger";
import fastifyPrintRoutes from "fastify-print-routes";
import fastifyBcrypt from "fastify-bcrypt";
import fastifySensible from "fastify-sensible";
import fastifyMultipart from "fastify-multipart";
import fp from "fastify-plugin";
import knexConfiguration from "./knexfile.js";
import {
  authenticationJWT,
  checkStaffAdminRole,
  checkTrainingAdminRole,
  checkActivitiesPriviledge,
  checkForUnknownUrlIds
} from "./src/plugins/fastifyPlugins.js";
import appRoutes from "./src/routes/index.js";
import { adminCheck } from "./src/decorators/fastifyDecorators.js";

// Initialize Knex / Objection Model
export const db = Knex(knexConfiguration[process.env.NODE_ENV]);
Model.knex(db);

// Initialize Fastify.
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
fastify.register(fp(authenticationJWT));
fastify.register(fp(checkStaffAdminRole));
fastify.register(fp(checkTrainingAdminRole));
fastify.register(fp(checkActivitiesPriviledge));
fastify.register(fp(checkForUnknownUrlIds));
fastify.decorate("checkAdminRole", adminCheck);
// Register routes
appRoutes.forEach((endpoint) => {
  fastify.route(endpoint);
});

export default fastify;
