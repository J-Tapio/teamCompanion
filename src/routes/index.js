import registerRoute from "./register.route.js";
import loginRoute from "./login.route.js";
import exercisesRouter from "./exercises.route.js";
import usersRouter from "./users.route.js";
import equipmentRouter from "./equipment.route.js"
import teamsRouter from "./teams.route.js";
import activitiesRouter from "./activities.route.js";

export default [
  registerRoute,
  loginRoute,
  usersRouter,
  teamsRouter,
  exercisesRouter, 
  equipmentRouter,
  activitiesRouter,
].flat();