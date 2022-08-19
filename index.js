import server from "./app.js";
const PORT = process.env.PORT || 3005;

server.listen({port: PORT, host: "0.0.0.0"}, function (error, address) {
  if (error) {
    server.log.error(error);
    process.exit(1); // Close-down the node process.
  } else {
    server.log.info(`Server started on port: ${PORT}`)
  }
})