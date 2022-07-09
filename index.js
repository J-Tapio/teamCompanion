import server from "./app.js";
const PORT = process.env.PORT || 3000;

server.listen({port: PORT}, function (error, address) {
  if (error) {
    server.log.error(error);
    process.exit(1); // Close-down the node process.
  } else {
    server.log.info(`Server started on port: ${PORT}`)
  }
})



