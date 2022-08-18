import 'dotenv/config';
import Knex from "knex";
import { Model } from "objection";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from '@fastify/swagger';
import fastifyPrintRoutes from "fastify-print-routes";
import fastifyBcrypt from "fastify-bcrypt";
import fastifySensible from '@fastify/sensible';
import fastifyMultipart from '@fastify/multipart';
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
  logger: {levels: ["error", "info"]},
  exposeHeadRoutes: false,
});

async function initializeFastify() {
  try {
    await fastify.register(fastifyPrintRoutes);
    await fastify.register(fastifyCors); // Specify whitelist later.
    await fastify.register(fastifySwagger, {
      exposeRoute: true,
      routePrefix: "/documentation",
      swagger: {
        info: {
          title: "TeamCompanion",
          description: "Team Companion API",
          version: "0.1.0",
        },
        host: "http://tc.juha-tap.io",
      },
    });
    await fastify.register(fastifySensible);
    await fastify.register(fastifyBcrypt, { saltWorkFactor: 14 });
    await fastify.register(fastifyMultipart);
    await fastify.register(fp(authenticationJWT));
    await fastify.register(fp(checkStaffAdminRole));
    await fastify.register(fp(checkTrainingAdminRole));
    await fastify.register(fp(checkActivitiesPriviledge));
    await fastify.register(fp(checkForUnknownUrlIds));
    fastify.decorate("checkAdminRole", adminCheck);
    // Register routes
    appRoutes.forEach((endpoint) => {
      fastify.route(endpoint);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

await initializeFastify();

export default fastify;
