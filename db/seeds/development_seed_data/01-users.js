//? Wondering what is the standard for seed data when inserting sensitive info
//? I think that in this case when development data is for demo purposes, no harm to even reveal the hash this way. Godspeed decrypting the hashes even with rainbow tables.

const password = {
admin: "$2a$14$Nu17EkJ.gv06HzTSUSGVFuNRb3yO.xQlO0IHki4lYqSX885UOLSuS",
coach: "$2a$14$zif3QP8azYv6qyomwBA0Cuh0Af0CeyElP7xqYiVoY5TuDZAS19eRO",
coach2: "$2a$14$AQW6RKpiaMvTmKb.0APiwOZGJGFyQmmVq9PN81vPTq/4UsvBPY/O6",
trainer: "$2a$14$8ptkq8zquBIpmmnk3nv1B..ZIcXQt7QHYT6TJZ8Yskv56ILw7Itqu",
physio: "$2a$14$dW6BBVcUaIg9801uxMykTeeL/pg9I73mZcD9FCH3xJ/EqdeD5U5tK",
staff: "$2a$14$Pm4pGihkMkkdJk8OMQxQGONyE65RjIu4lf7zjVO.bW3YpOjpgf01C",
athlete: "$2a$14$01oprlRx4FkF7noB7J8u1OezYpHtDSYI0bTrjYDPvUwEQ0.k8Og1e",
athlete2: "$2a$14$XqeD6vqcTRDyHrs3Ua.qKez2z4vA7Jr6sXjH2q7Nm6/PtmFRJWeIi",
athlete3: "$2a$14$tmQibETVJTSmhVSmFhcod.Oql9gc/55POr1UGHb.6aZoGLbJuxFIO",
athlete4: "$2a$14$xIXxkaNHvIn3h/tvkkeAt.1IfzuNUA6kRC.U3CfEdVRj/Rr50vuYq",
athlete5: "$2a$14$coMDX3aqMfimw9dAYzF2WeJD9Y4mqdg644XVJBjvu1d.voZShBpQm",
athlete6: "$2a$14$b07o4RzUaKch3yvzFuVOduMKs38VqjuTrRVbiJIOMC0QwBLI2T8Le",
athlete7: "$2a$14$q8FOMvok.WXmzgxSXhhgOO90qca8ANtjGCeRTkgctkdxZSkpr7FTS",
athlete8: "$2a$14$wNVgyCs7v9/NF0vgU1x5De9h0A11gN7Wz5SMRNzbaKy55vctDjSTm",
athlete9: "$2a$14$3SRnSjZFvcoQqB8t94aEsO9gDm5yzG7LxWChTJigdkezoe6Wllc56",
athlete10: "$2a$14$bX.aJouWZ1mZmj49Aehd8Oo/4Ck6yCg8S7B2KxLwScLP..QTIxHH6",
}


export default [
  {
    id: 1,
    email: "admin@mail.com",
    password: password.admin,
    role: "admin",
    emailStatus: "active"
  },
  {
    id: 2,
    email: "coach@hawkinsfc.com",
    password: password.coach,
    emailStatus: "active",
  },
  {
    id: 3,
    email: "coach2@mail.com",
    password: password.coach2,
    emailStatus: "active",
  },
  {
    id: 4,
    email: "trainer@mail.com",
    password: password.trainer,
    emailStatus: "active",
  },
  {
    id: 5,
    email: "physio@mail.com",
    password: password.physio,
    emailStatus: "active",
  },
  {
    id: 6,
    email: "athlete1@mail.com",
    password: password.athlete,
    emailStatus: "active",
  },
  {
    id: 7,
    email: "athlete2@mail.com",
    password: password.athlete2,
    emailStatus: "active",
  },
  {
    id: 8,
    email: "athlete3@mail.com",
    password: password.athlete3,
    emailStatus: "active",
  },
  {
    id: 9,
    email: "athlete4@mail.com",
    password: password.athlete4,
    emailStatus: "active",
  },
  {
    id: 10,
    email: "athlete5@mail.com",
    password: password.athlete5,
    emailStatus: "active",
  },
  {
    id: 11,
    email: "athlete6@mail.com",
    password: password.athlete6,
    emailStatus: "active",
  },
  {
    id: 12,
    email: "athlete7@mail.com",
    password: password.athlete7,
    emailStatus: "active",
  },
  {
    id: 13,
    email: "athlete8@mail.com",
    password: password.athlete8,
    emailStatus: "active",
  },
  {
    id: 14,
    email: "athlete9@mail.com",
    password: password.athlete9,
    emailStatus: "active",
  },
  {
    id: 15,
    email: "athlete10@mail.com",
    password: password.athlete10,
    emailStatus: "active",
  },
  {
    id: 16,
    email: "staff@mail.com",
    password: password.staff,
    emailStatus: "active",
  },
];
