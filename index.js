import server from "./app.js";
import { db } from "./app.js";
import cron from "node-cron";
const PORT = process.env.PORT || 3005;

server.listen({ port: PORT, host: "0.0.0.0" }, function (error, address) {
  if (error) {
    server.log.error(error);
    process.exit(1); // Close-down the node process.
  } else {
    server.log.info(`Server started on port: ${PORT}`);
    if (process.env.NODE_ENV === "development") {
      cron.schedule("0,15,30,45 * * * *", async(now) => {
        try {
          console.log(`Scheduled database data reset - ${now}`);
          //console.log(db.client.connectionSettings);
          await db.migrate.rollback({all: true});
          await db.migrate.latest();
          console.log("KNEX/DB - RUN DEFAULT SEED FILES");
          await db.seed.run();
        } catch (error) {
          server.log.error(error);
        }
      });
    }
  }
});


