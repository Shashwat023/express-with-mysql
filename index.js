const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require ("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'Shashwat@mysql23'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password()
  ];
};

//home route
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try{
    connection.query (q, (err, result) => {
    if(err) throw err;
    let count = result [0]["count(*)"];
    res.render("home", {count});
  });
  } catch (err) {
    console.log(err);
    res.send("some error at DB");
  }
});

//show route
app.get("/users", (req, res) => {
  let q = `SELECT * FROM user`;
  try{
    connection.query (q, (err, result) => {
    if(err) throw err;
      res.render("showusers.ejs", {result});
      console.log(result[0]);
  });
  } catch (err) {
      console.log(err);
      res.send("some error at DB");
  }
});

//Edit route
app.get("/users/:id/edit", (req, res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try{
    connection.query (q, (err, result) => {
    if(err) throw err;
      let user = result[0];
      console.log(result);
      res.render("edit", {user});
  });
  } catch (err) {
      console.log(err);
      res.send("some error at DB");
  }
});

//update route
app.patch("/users/:id", (req, res) => {
  let {id} = req.params;
  let {password: formPass, username: newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try{
    connection.query (q, (err, result) => {
    if(err) throw err;
      let user = result[0];
      if (formPass != user.password){
        res.send("wrong pass");
      }
      else{
        let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/users");
        });
      }
      console.log(result);
  });
  } catch (err) {
      console.log(err);
      res.send("some error at DB");
  }
});


app.listen ("8080", (req, res) => {
  console.log("app is listening on port 8080");
});

