
export default [
  {
    method: "POST",
    url: "/auth/token/refresh",
    handler: refreshTokens,
    config: {
      description: "Refresh access token and refresh token"
    }
  },
  {
    method: "GET",
    url: "/auth/account/verification",
    handler: verifyAccount,
    config: {
      description: "Account verification"
    }
  },
  {
    method: "POST",
    url: "/auth/password/reset",
    handler: verifyUser,
    config: {
      description: "Verify that user exists with email from database"
    }
  },
];
