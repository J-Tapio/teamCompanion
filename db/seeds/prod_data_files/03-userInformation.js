export const seed = function(knex) {

  return knex('user_information').insert([
    {
      id: 1,
      userId: 1, 
      firstName: "Juha",
      lastName: "Turpeinen", 
      dateOfBirth: "1988-11-14", 
      address: { 
        streetAddress:"Admin Street 100", 
        city: "Berlin", 
        state: "Berlin", 
        zipCode: "12051", 
        country: "Germany"
      }
    }
  ])
}