import app from "./app.js";
const PORT = process.env.PORT || 3000;

app.listen(PORT, function (error, address) {
  if (error) {
    fastify.log.error(error);
    process.exit(1); // Close-down the node process.
  } else {
    console.log("Server started on port: ", PORT)
  }
})



