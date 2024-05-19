'use strict';

const express = require('express');
const app = express();

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

// other required modules ...
const multer = require("multer"); // import multer into your project
const cors = require('cors');

app.use(cors());

// For data sent as form-urlencoded
app.use(express.urlencoded({ extended: true }));
// For data sent as json
app.use(express.json());
// For data sent as a form
app.use(multer().none()); // requires the "multer" module

let currentUserID = 0;

app.post("/REM/login", async (req, res) => {
  let db = await getDBConnection();
  let email = req.body.Email;
  let password = req.body.Password;

  try {
    let user = await db.get("SELECT * FROM User WHERE Email = ?", [email]);
    if (user) {
      currentUserID = user.ID;
      if (password === user.Password) {
        res.type("text").send("Login successful!");
      } else {
        res.type("text").send("Invalid password");
      }
    } else {
      res.type("text").send("Email not found");
    }
  } catch (error) {
    res.status(500).send("An error occurred");
  }

})

app.get("/watchdetails/:ID", async function (req, res) {
  try {
    let watchID = req.params.ID;
    let qry = `Select * FROM watches WHERE Type = "${watchID}"`;
    let db = await getDBConnection();
    let result = await db.get(qry);
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.type("text");
    res.status(500).send("Internal Server Error");
  }
});

app.post("/REM/createAccount", async (req, res) => {
  let db = await getDBConnection();
  let email = req.body.Email;
  let password = req.body.Password;
  let gender = req.body.Gender;
  let firstName = req.body.FirstName;
  let lastName = req.body.LastName;
  let month = req.body.Month;
  let day = req.body.Day;
  let year = req.body.Year;
  let checkEmailSql = 'SELECT Email FROM User WHERE Email = ?';
  try {
    let row = await db.get(checkEmailSql, [email]);
    if (row) {
      res.type("text").send("Email Already Exists");
    } else {
      let sql = 'INSERT INTO User (Email, Password, Gender, FirstName, LastName, DayOfBirth, MonthOfBirth, YearOfBirth) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      await db.run(sql, [email, password, gender, firstName, lastName, day, month, year]);
      res.send("Create Account Successful");
    }
  } catch (err) {
    res.type("text").send("Failed To Create Account");
  }
});


app.get("/REM/getwatchesinfo", async (req, res) => {
  try {
    let db = await getDBConnection();
    let getwatchesSql = 'SELECT * FROM WATCHES JOIN Shoppingcart ON WATCHES.ID = Shoppingcart.WatchID JOIN User ON User.ID = Shoppingcart.UserID WHERE User.ID=?';
    let arrayOfWatches = await db.all(getwatchesSql, [currentUserID]);
    res.type("json").send(arrayOfWatches);
  } catch (err) {
    res.type("json").send({ "errMessage": err })
  }
});



/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'watch.db',
    driver: sqlite3.Database
  });
  return db;
}


app.use(express.static('public'));
const PORT = process.env.PORT || 8080;
app.listen(PORT);