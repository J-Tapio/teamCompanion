export const seed = function (knex) {
  return knex("teams").insert(
    {
      id: 1,
      name: "Admin FC",
      address: {
        streetAddress: "Organisation Street 2, 10C",
        city: "Berlin",
        state: "Berlin",
        zipCode: "12051",
        country: "Berlin",
      },
    }
  );
};
