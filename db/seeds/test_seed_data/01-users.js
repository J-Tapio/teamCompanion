// Passwords hashed before-hand for db seed insertion

const examplePwd1 =
  "$2a$14$xThvh0pzkahL5b7PhHhfeu0GHgdfA2jGRZ/UoWoAs/BnvHS79uboS";
const examplePwd2 =
  "$2a$14$E1m0a9kKut/vUzUKeOdZWOQOtFVp1Q.sA3bT4r77pd10wSTHctqOS";
const examplePwd3 =
  "$2a$14$Gp1XeJHTEgvY4l3kMoyH6.tZ2ROjKvsu.B6e7EMAWr65oajLjXlWy";
const examplePwd4 =
  "$2a$14$ixU04CRzlGguUxbAWIKuNuypqJ5.chvzr5lgDqb61JYUzuzX1IuK2";
const examplePwd5 =
  "$2a$14$gYVdZj4VjYzO34Ki9eE6o.vL5pgXx/0Lhx7U/IVLME33WuvhuxSNW";
const examplePwd6 =
  "$2a$14$efuULtcucU0xIIZi6wcvPeLI1IxtC947GCPfnm7vGMM9fFeoPr6PG";



export default [
  {
    id: 1,
    email: "admin@mail.com",
    password: examplePwd1,
    role: "admin",
    emailStatus: "active"
  },
  {
    id: 2,
    email: "coach@mail.com",
    password: examplePwd2,
    emailStatus: "active",
  },
  {
    id: 3,
    email: "physio@mail.com",
    password: examplePwd3,
    emailStatus: "active",
  },
  {
    id: 4,
    email: "trainer@mail.com",
    password: examplePwd4,
    emailStatus: "active",
  },
  {
    id: 5,
    email: "athlete@mail.com",
    password: examplePwd5,
    emailStatus: "active",
  },
  {
    id: 6,
    email: "staff@mail.com",
    password: examplePwd6,
    emailStatus: "active",
  },
];
