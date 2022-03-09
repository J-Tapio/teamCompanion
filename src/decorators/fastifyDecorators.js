export function adminCheck(request, reply, done) {
  try {
    request.user.roles.includes("admin") && done();
    !request.user.roles.includes("admin") && reply.forbidden();
  } catch (error) {
    reply.internalServerError();
  }
}
